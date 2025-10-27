import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function GoalsCard() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/tasks`;

  // Fetch tasks
  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(API, {
          headers: { "x-auth-token": token },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.errors?.[0]?.msg || "Failed to fetch tasks");

        const formatted = data.map((task) => ({
          ...task,
          completed: task.status === "completed",
        }));

        setGoals(formatted);
      } catch (err) {
        console.error("Error fetching goals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [API]);

  // Toggle completion
  const toggleCompletion = async (goal) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setUpdatingId(goal._id);

    try {
      const res = await fetch(`${API}/${goal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          status: goal.completed ? "pending" : "completed",
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.errors?.[0]?.msg || "Failed to update goal");

      setGoals((prev) =>
        prev.map((g) =>
          g._id === goal._id
            ? {
                ...g,
                completed: !goal.completed,
                status: goal.completed ? "pending" : "completed",
              }
            : g,
        ),
      );
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const progress = goals.length ? (completedCount / goals.length) * 100 : 0;

  if (loading)
    return (
      <Card className="w-full sm:w-auto p-6 animate-pulse">
        <h3 className="text-[var(--primary)] font-semibold">Goals</h3>
        <p className="text-gray-400 text-sm mt-2">Loading goals...</p>
      </Card>
    );

  const pendingGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const listClass = "max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-hidden"; // hide scrollbar

  return (
    <Card className="w-full sm:w-auto p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-[var(--primary)] text-lg">Goals</h3>

        {/* Progress bar */}
        <div className="w-full bg-[var(--border)] h-2 rounded-full mt-2">
          <div
            className="bg-[var(--accent)] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-3">
            <TabsTrigger value="pending">
              Pending ({pendingGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Goals */}
          <TabsContent value="pending">
            <ul className={listClass}>
              <AnimatePresence>
                {pendingGoals.length === 0 ? (
                  <p className="text-[var(--muted-foreground)] text-sm">
                    No pending goals.
                  </p>
                ) : (
                  pendingGoals.map((goal) => (
                    <motion.li
                      key={goal._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-between bg-[var(--card)] rounded-xl px-3 py-2 border border-[var(--border)] transition-all ${
                        updatingId === goal._id
                          ? "opacity-70"
                          : "hover:bg-[var(--muted)] hover:scale-[1.01]"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => toggleCompletion(goal)}
                      >
                        <Circle className="text-[var(--muted-foreground)] w-5 h-5" />
                        <span className="text-sm text-[var(--card-foreground)]">
                          {goal.title}
                        </span>
                      </div>
                      <Badge className="text-xs px-2 py-1 rounded-md border-none bg-[var(--primary)]/10 text-[var(--primary)]">
                        Pending
                      </Badge>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          </TabsContent>

          {/* Completed Goals */}
          <TabsContent value="completed">
            <ul className={listClass}>
              <AnimatePresence>
                {completedGoals.length === 0 ? (
                  <p className="text-[var(--muted-foreground)] text-sm">
                    No completed goals.
                  </p>
                ) : (
                  completedGoals.map((goal) => (
                    <motion.li
                      key={goal._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-between bg-[var(--card)] rounded-xl px-3 py-2 border border-[var(--border)] transition-all ${
                        updatingId === goal._id
                          ? "opacity-70"
                          : "hover:bg-[var(--muted)] hover:scale-[1.01]"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => toggleCompletion(goal)}
                      >
                        <CheckCircle2 className="text-[var(--accent)] w-5 h-5" />
                        <span className="text-sm line-through text-[var(--muted-foreground)]">
                          {goal.title}
                        </span>
                      </div>
                      <Badge className="text-xs px-2 py-1 rounded-md border-none bg-[var(--accent)]/20 text-[var(--accent-foreground)]">
                        Completed
                      </Badge>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
