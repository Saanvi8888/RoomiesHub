export const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
);

export const ActivityRowSkeleton = () => (
  <div className="flex items-start gap-3 px-5 py-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2">
      <Bone className="h-4 w-3/4" />
      <Bone className="h-3 w-16" />
    </div>
  </div>
);

export const MemberRowSkeleton = () => (
  <div className="flex items-center gap-3 px-5 py-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2">
      <Bone className="h-4 w-2/3" />
      <Bone className="h-3 w-12" />
    </div>
  </div>
);

export const InventoryRowSkeleton = () => (
  <div className="flex items-center gap-3 px-5 py-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-2">
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Bone className="h-7 w-7 rounded-lg" />
          <Bone className="h-8 w-[60px]" />
          <Bone className="h-7 w-7 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-7 w-7 rounded-lg" />
          <Bone className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export const ExpenseRowSkeleton = () => (
  <div className="flex items-start gap-3 px-5 py-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-44" />
        </div>
        <div className="flex flex-col items-end space-y-2 shrink-0">
          <Bone className="h-4 w-16" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-4 mt-3">
        <Bone className="h-3 w-10" />
        <Bone className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export const SettlementRowSkeleton = () => (
  <div className="flex items-start gap-3 px-5 py-4">
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <Bone className="mt-3 h-4 w-4 shrink-0" />
    <Bone className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-4 w-36" />
          <Bone className="h-3 w-24" />
        </div>
        <div className="flex flex-col items-end space-y-2 shrink-0">
          <Bone className="h-4 w-16" />
          <Bone className="h-3 w-14" />
        </div>
      </div>
    </div>
  </div>
);

export const NoteCardSkeleton = () => (
  <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="mb-4 flex items-center justify-between">
      <Bone className="h-7 w-7 rounded-full" />
    </div>
    <div className="space-y-3">
      <Bone className="h-5 w-3/4" />
      <div className="space-y-2">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
      </div>
    </div>
    <div className="mt-6 border-t border-white/10 pt-2 space-y-1.5">
      <Bone className="h-3 w-20" />
      <Bone className="h-2.5 w-16" />
    </div>
  </div>
);

export const ReminderCardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex justify-between gap-4">
      <div className="flex-1 space-y-2">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-3/4" />
        <div className="flex gap-3 pt-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-16" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Bone className="h-8 w-8 rounded-lg" />
        <Bone className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  </div>
);