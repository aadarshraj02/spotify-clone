import { useMusicStore } from "@/stores/useMusicStore";

const SongsTable = () => {
  const { songs, isLoading, error } = useMusicStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading Songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <div>SongsTable</div>;
};
export default SongsTable;
