type WidgetProps =
  | { state: "real"; title: string; children: React.ReactNode }
  | { state: "locked"; title: string; phase: number };

export function Widget(props: WidgetProps) {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <span className="widget-title">{props.title}</span>

        <div className="widget-body">
          {props.state === "locked" ? (
            <div className="widget-locked">
              🔒 <span>Coming in Phase {props.phase}</span>
            </div>
          ) : (
            props.children
          )}
        </div>
      </div>
    </div>
  );
}
