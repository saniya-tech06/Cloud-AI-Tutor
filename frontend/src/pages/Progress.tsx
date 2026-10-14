
import Navbar from "../components/navbar";
import MenuBar from "../components/MenuBar";

import {
  BookOpen,
  FileText,
  Star,
  Clock,
  Trophy,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getProgress } from "../api/progressApi";

function Progress() {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
  const fetchProgress = async () => {
    try {
      const data = await getProgress();
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProgress();
}, []);

  if (!progress) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        Loading Progress...
      </div>
    );
  }

  const statistics = [
    {
      title: "Study Spaces",
      value: progress.totalStudySpaces,
      icon: BookOpen,
      color: "text-blue-400",
    },

    {
      title: "Documents",
      value: progress.totalDocuments,
      icon: FileText,
      color: "text-green-400",
    },

    {
      title: "Favorite Spaces",
      value: progress.favoriteSpaces,
      icon: Star,
      color: "text-yellow-400",
    },

    {
      title: "Recent Activity",
      value: progress.recentSpaces.length,
      icon: Clock,
      color: "text-purple-400",
    },


  {
  title: "Average Quiz Score",
  value: progress.averageQuizScore || "0%",
  icon: Trophy,
  color: "text-orange-400",
  detail: `${progress.totalQuizAttempts || 0} submitted quiz${progress.totalQuizAttempts === 1 ? "" : "zes"}`,
},
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <MenuBar />

      <main className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          My Progress 📊
        </h1>

        <p className="text-slate-400 mt-2">
          Track your AI-powered learning journey.
        </p>

        {/* Statistics */}

        <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-5
    gap-6
    mt-8
  "
>


          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-2xl
                  p-6
                  hover:border-blue-500
                  hover:-translate-y-1
                  transition
                "
              >
                <Icon size={35} className={stat.color} />

                <h3 className="text-slate-400 mt-5">
                  {stat.title}
                </h3>

                <p className="text-4xl font-bold mt-2">
                  {stat.value}
                </p>

                {"detail" in stat && (
                  <p className="mt-2 text-xs text-slate-500">
                    {stat.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Learning Summary */}

        <div
          className="
            mt-10
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold mb-3">
            Learning Summary
          </h2>

          <p className="text-slate-300 leading-relaxed">
            You have created
            <span className="text-blue-400 font-semibold mx-1">
              {progress.totalStudySpaces}
            </span>
            study spaces and uploaded
            <span className="text-green-400 font-semibold mx-1">
              {progress.totalDocuments}
            </span>
            learning materials for your AI-powered study journey.
          </p>
        </div>

        {/* Recent Study Spaces */}

        <div
          className="
            mt-10
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold mb-5">
            Recent Study Spaces
          </h2>

          {progress.recentSpaces.length === 0 ? (
            <p className="text-slate-400">
              No study spaces yet
            </p>
          ) : (
            progress.recentSpaces.map((space: any) => (
              <div
                key={space.id}
                className="
                  border-b
                  border-slate-800
                  py-4
                  last:border-b-0
                "
              >
                <h3 className="font-semibold text-lg">
                  📘 {space.title}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  Created {new Date(space.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Recent Documents */}

        <div
          className="
            mt-10
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-2xl font-semibold mb-5">
            Recent Documents
          </h2>

          {progress.recentDocuments.length === 0 ? (
            <p className="text-slate-400">
              No documents uploaded
            </p>
          ) : (
            progress.recentDocuments.map((doc: any) => (
              <div
                key={doc.id}
                className="
                  border-b
                  border-slate-800
                  py-4
                  last:border-b-0
                "
              >
                <h3>📄 {doc.original_name}</h3>

                <p className="text-sm text-slate-400 mt-1">
                  Uploaded {new Date(doc.upload_date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}


export default Progress;

