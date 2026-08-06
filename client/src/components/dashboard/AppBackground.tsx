export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#0a0a0f]">
      <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-purple-600/25 blur-[120px]"></div>
      <div className="absolute -button-40 -left-40 h-125 w-125 rounded-full bg-violet-800/25 blur-[130px]"></div>
    </div>
  );
}
