import React from "react";
import { Bell } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";

/* ------------------------------------------------------------
   PAGE: ACTIVITY
   Activity remains backed by GET /activity. Notifications are now
   backed by GET /notifications and stored in the database; the app
   never fabricates notification data.
   component only needs its data source wired in — the layout,
   empty/loading/error states and item renderer are ready for it.
   ------------------------------------------------------------ */
export function ActivityPage({ go }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity</h1>
        <EmptyState icon={Bell} title="Log in to see your activity" subtitle="Track favorites, advertisement status, and account updates in one place." action={<Button onClick={() => go("login")}>Log in</Button>} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity</h1>
      <EmptyState
        icon={Bell}
        title="Nothing here yet"
        subtitle="Once SHINEX's activity feed is live, updates about your favorites, listings, advertisements and account will show up here."
      />
    </div>
  );
}
