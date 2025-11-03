"use client";

interface Badge {
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
}

interface BadgeDisplayProps {
  badges: string[] | Badge[];
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

export function BadgeDisplay({ badges, size = "md", showDescription = true }: BadgeDisplayProps) {
  const getBadgeInfo = (badge: string | Badge): Badge => {
    if (typeof badge === "object") return badge;

    // Map badge names to their info
    const badgeMap: Record<string, Omit<Badge, "name">> = {
      "First Note": {
        description: "Posted your first note",
        icon: "🎯",
        rarity: "common",
      },
      "10 Notes": {
        description: "Posted 10 notes",
        icon: "📝",
        rarity: "common",
      },
      "Century": {
        description: "Posted 100 notes",
        icon: "💯",
        rarity: "rare",
      },
      "Prolific Writer": {
        description: "Posted 1000 notes",
        icon: "✍️",
        rarity: "epic",
      },
      "100 Likes": {
        description: "Received 100 likes",
        icon: "❤️",
        rarity: "common",
      },
      "1K Likes": {
        description: "Received 1000 likes",
        icon: "💖",
        rarity: "rare",
      },
      "10K Likes": {
        description: "Received 10000 likes",
        icon: "💕",
        rarity: "legendary",
      },
      "Early Adopter": {
        description: "Joined in the first month",
        icon: "🌟",
        rarity: "rare",
      },
      "Influencer": {
        description: "1000+ followers",
        icon: "📣",
        rarity: "epic",
      },
      "Community Builder": {
        description: "Created a community",
        icon: "🏗️",
        rarity: "rare",
      },
      "Premium": {
        description: "Premium member",
        icon: "👑",
        rarity: "epic",
      },
      "Verified": {
        description: "Verified account",
        icon: "✓",
        rarity: "rare",
      },
    };

    return {
      name: badge,
      ...(badgeMap[badge] || {
        description: badge,
        icon: "🏅",
        rarity: "common" as const,
      }),
    };
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-500";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return "w-12 h-12 text-xl";
      case "md":
        return "w-16 h-16 text-2xl";
      case "lg":
        return "w-20 h-20 text-3xl";
      default:
        return "w-16 h-16 text-2xl";
    }
  };

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🏆</div>
        <p>No badges earned yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge, index) => {
        const badgeInfo = getBadgeInfo(badge);
        return (
          <div
            key={index}
            className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer"
          >
            {/* Badge Icon */}
            <div
              className={`${getBadgeSize()} rounded-full bg-gradient-to-br ${getRarityColor(
                badgeInfo.rarity
              )} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <span className="drop-shadow-lg">{badgeInfo.icon}</span>
            </div>

            {/* Badge Name */}
            <h4 className="font-bold text-gray-900 text-center text-sm mb-1">
              {badgeInfo.name}
            </h4>

            {/* Rarity */}
            <div className="text-center mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  badgeInfo.rarity === "common"
                    ? "bg-gray-100 text-gray-700"
                    : badgeInfo.rarity === "rare"
                    ? "bg-blue-100 text-blue-700"
                    : badgeInfo.rarity === "epic"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {badgeInfo.rarity.toUpperCase()}
              </span>
            </div>

            {/* Description (on hover) */}
            {showDescription && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">{badgeInfo.icon}</div>
                <p className="text-sm text-center font-medium mb-1">{badgeInfo.name}</p>
                <p className="text-xs text-center text-gray-300">{badgeInfo.description}</p>
                {badgeInfo.earnedAt && (
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Earned {badgeInfo.earnedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BadgeMini({ badge }: { badge: string }) {
  const badgeInfo = {
    "First Note": "🎯",
    "10 Notes": "📝",
    "Century": "💯",
    "100 Likes": "❤️",
    "1K Likes": "💖",
    "Premium": "👑",
    "Verified": "✓",
  }[badge] || "🏅";

  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full text-white text-xs"
      title={badge}
    >
      {badgeInfo}
    </span>
  );
}

