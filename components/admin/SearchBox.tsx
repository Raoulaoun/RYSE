// A plain GET form, so search works without client JavaScript.
export function SearchBox({
  placeholder,
  value = "",
  keep = {},
  wide,
}: {
  placeholder: string;
  value?: string;
  keep?: Record<string, string>;
  wide?: boolean;
}) {
  return (
    <form action="/admin/applications" role="search">
      <label htmlFor="adm-search" className="sr">
        Search applications
      </label>
      {Object.entries(keep).filter(([, v]) => v).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input
        id="adm-search"
        name="q"
        type="search"
        placeholder={placeholder}
        defaultValue={value}
        className={"search" + (wide ? " wide" : "")}
      />
    </form>
  );
}
