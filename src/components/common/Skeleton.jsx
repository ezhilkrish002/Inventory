export function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-4 py-3">
          <div className={`skeleton h-4 rounded ${i === 1 ? 'w-32' : i === 2 ? 'w-20' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      <div className="skeleton h-5 w-1/2 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  );
}

export function ProductTableSkeleton({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => <SkeletonRow key={i} />)}
    </>
  );
}
