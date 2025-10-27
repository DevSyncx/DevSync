import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX;

// Add delay to respect API rate limits
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clearAllVectors() {
  console.log(`\n🚨 === CLEARING ALL VECTORS FROM PINECONE INDEX ===`);
  console.log(`Pinecone Index: ${indexName}`);
  console.log(`⚠️  WARNING: This will delete ALL vectors permanently!`);

  try {
    const index = pinecone.Index(indexName);
    console.log("✅ Connected to Pinecone index");

    // Get current stats
    console.log("📊 Getting current index statistics...");
    const initialStats = await index.describeIndexStats();
    const totalVectors = initialStats.totalRecordCount || 0;

    console.log(`📋 Current state:`);
    console.log(`  - Total vectors: ${totalVectors}`);
    console.log(`  - Index dimension: ${initialStats.dimension}`);
    console.log(`  - Index fullness: ${initialStats.indexFullness}`);

    if (totalVectors === 0) {
      console.log("ℹ️  Index is already empty. Nothing to clear.");
      return;
    }

    // Final confirmation in logs
    console.log(`\n🚨 PROCEEDING TO DELETE ALL ${totalVectors} VECTORS`);
    console.log("⚠️  This action cannot be undone!");

    // Method 1: Try to delete all vectors by namespace (fastest)
    try {
      console.log("\n🧹 Attempting to clear entire namespace...");
      await index.deleteAll();
      console.log("✅ Successfully cleared entire namespace");

      // Wait for operation to complete
      await delay(5000);
    } catch (deleteAllError) {
      console.log("⚠️  deleteAll() failed, trying alternative method...");
      console.error("Error:", deleteAllError.message);

      // Method 2: Get all vectors and delete them in batches
      console.log("🔍 Fetching all vectors for batch deletion...");

      const allVectors = await index.query({
        vector: Array(1024).fill(0.1),
        topK: 10000, // Max limit
        includeMetadata: false,
        includeValues: false,
      });

      if (allVectors.matches && allVectors.matches.length > 0) {
        console.log(`📋 Found ${allVectors.matches.length} vectors to delete`);

        // Delete in batches
        const batchSize = 1000;
        let deleted = 0;

        for (let i = 0; i < allVectors.matches.length; i += batchSize) {
          const batch = allVectors.matches.slice(i, i + batchSize);
          const batchIds = batch.map((v) => v.id);

          try {
            await index.deleteMany(batchIds);
            deleted += batch.length;
            console.log(
              `  🗑️  Deleted batch: ${batch.length} vectors (total: ${deleted}/${allVectors.matches.length})`,
            );

            await delay(1000);
          } catch (batchError) {
            console.error(`  ❌ Failed to delete batch:`, batchError.message);
          }
        }

        console.log(
          `✅ Batch deletion completed: ${deleted}/${allVectors.matches.length} vectors`,
        );
      }
    }

    // Verify the clearing
    console.log("\n🔍 Verifying index is cleared...");
    await delay(3000); // Wait for Pinecone to sync

    const finalStats = await index.describeIndexStats();
    const remainingVectors = finalStats.totalRecordCount || 0;

    console.log(`\n📊 Final Results:`);
    console.log(`  - Initial vectors: ${totalVectors}`);
    console.log(`  - Remaining vectors: ${remainingVectors}`);
    console.log(`  - Vectors cleared: ${totalVectors - remainingVectors}`);

    if (remainingVectors === 0) {
      console.log("🎉 SUCCESS: All vectors have been cleared from the index!");
      console.log(
        "💡 You can now repopulate with fresh data using the populate script.",
      );
    } else {
      console.log(
        `⚠️  WARNING: ${remainingVectors} vectors still remain in the index.`,
      );
      console.log(
        "This might be due to Pinecone sync delays. Check again in a few minutes.",
      );
    }
  } catch (error) {
    console.error("❌ Error during clearing:", error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
📖 Usage: node scripts/clear-all-vectors.js --force

🔧 Required Environment Variables:
  - PINECONE_API_KEY: Pinecone API key
  - PINECONE_INDEX: Pinecone index name

📝 This script will:
  1. Connect to your Pinecone index
  2. Delete ALL vectors in the index
  3. Verify the clearing operation
  
🚨 WARNING: This will permanently delete ALL data in your Pinecone index!
⚠️  This action cannot be undone!

🛡️  Safety: Requires --force flag to run
  `);
  process.exit(0);
}

// Safety check - require --force flag
if (!args.includes("--force")) {
  console.log(`
🚨 DANGER: This script will delete ALL vectors from your Pinecone index!

📋 What it will do:
  • Connect to index: ${indexName}
  • Delete every single vector in the database
  • Clear all issue embeddings and similarity data

🚨 THIS ACTION CANNOT BE UNDONE!

🛡️  For safety, this script requires the --force flag:
     node scripts/clear-all-vectors.js --force

💡 Alternative: Use the cleanup script to remove only duplicates:
     node scripts/cleanup-duplicates.js --force

📖 For help: node scripts/clear-all-vectors.js --help
  `);
  process.exit(0);
}

// Final confirmation before destruction
console.log(`
⚠️  FINAL WARNING ⚠️

You are about to DELETE ALL VECTORS from Pinecone index: ${indexName}

This will:
- Remove all issue embeddings
- Destroy all similarity data
- Require repopulation from scratch

Proceeding in 3 seconds...
`);

// 3 second countdown
setTimeout(() => {
  console.log("3...");
  setTimeout(() => {
    console.log("2...");
    setTimeout(() => {
      console.log("1...");
      setTimeout(() => {
        clearAllVectors().catch((error) => {
          console.error("💥 Script failed:", error);
          process.exit(1);
        });
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
