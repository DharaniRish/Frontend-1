const AdminTable = ({ columns, rows, renderRow }) => (
  <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-black/10 text-sm">
        <thead className="bg-pearl text-left text-xs uppercase tracking-[0.14em] text-ink/55">
          <tr>{columns.map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-black/10">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  </div>
);

export default AdminTable;
