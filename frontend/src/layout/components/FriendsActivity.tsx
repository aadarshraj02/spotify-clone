import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendsActivity = () => {
  const { users, fetchUsers } = useChatStore();
  const user = useUser();

  const isPlaying = false;

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they are listening to</h2>
        </div>
      </div>

      {!user && <LoginPrompt />}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user) => (
            <div
              key={user?._id}
              className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
            >
              <div className="fle items-start gap-3">
                <div className="relative">
                  <Avatar className="size-10 border border-zinc-800">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-500"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-white">
                      {user?.fullName}
                    </span>
                    {isPlaying && (
                      <Music className="size-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  {isPlaying ? (
                    <div className="mt-1">
                      <div className="mt-1 text-sm text-white font-medium truncate">
                        Any Song
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        by Any Singer
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-zinc-400">Idle</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-900 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>
    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        {" "}
        See what Friends are Listening
      </h3>
      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now.
      </p>
    </div>
  </div>
);
