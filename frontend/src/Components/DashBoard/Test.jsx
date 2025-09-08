import ActivityHeatmap from "./ActivityHeatMap";
import GoalsCard from "./GoalsCard";
import NotesCard from "./NotesCard";
import PlatformLinks from "./PlatformLinks";
import ProfileCard from "./ProfileCard";
import Sidebar from "./Sidebar";
import StreakCard from "./StreakCard";
import TimeSpentCard from "./TimeSpentCard";
import Topbar from "./Topbar";

function TestDashboardPage() {
  // Dummy data for demonstration
  const user = { name: 'Test User', email: 'test@example.com', avatar: '', platforms: [{ name: 'GitHub', url: '', icon: '', lastActive: '1 day ago' }] };
  const platforms = user.platforms;
  const streak = 7;
  const goals = ['Finish project', 'Write docs'];
  const notes = ['Note 1', 'Note 2'];
  const timeSpent = '2h 30m';
  const activityData = [];

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileCard user={user} />
          <PlatformLinks platforms={platforms} />
          <StreakCard streak={streak} />
          <GoalsCard goals={goals} onGoalsChange={() => {}} />
          <TimeSpentCard time={timeSpent} />
          <NotesCard notes={notes} onNotesChange={() => {}} />
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <ActivityHeatmap activityData={activityData} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TestDashboardPage;