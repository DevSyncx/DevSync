import { User } from "lucide-react";
import React from "react";
import CardWrapper from "./CardWrapper";

export default function ProfileCard({ user }) {
  if (!user) return null; // don't render until user is loaded

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center flex-col gap-3">
        {/* Avatar */}
  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <User size={28} />
          )}
        </div>

        {/* Name + Email */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--primary)]">{user.name}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-3">
        <p className="text-md font-medium text-[var(--primary)] mb-1">Platforms</p>
        {user.platforms && user.platforms.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {user.platforms.map((p) => (
              <div
                key={p.name}
                className="w-10 h-10 flex items-center justify-center ml-3 rounded-md bg-[var(--accent)] shadow-sm"
                title={p.name}
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)] italic">
            No platforms linked yet
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
