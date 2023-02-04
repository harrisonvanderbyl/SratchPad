import { InputField } from "../../inputs/Input";
import { ItemDropZone } from "../../items/itemdropzone/itemDropZone";
import { AlteredItem } from "../../items/itemEditor";
import { History, HistoryFilter } from "../Character.types";
import "./history.scss";

export const HistoryItem = ({
  data: [event, setEvent] = [{ ID: "", parentID: "" }, () => ({})],
  filter: [filter, setFilter],
  catalog,
  SubEventsCount,
  dropDeps = [],
}: {
  data: [History, (value: History) => void];
  filter: [HistoryFilter, (value: HistoryFilter) => void];
  catalog: { [key: string]: AlteredItem };
  dropDeps?: any[];
  SubEventsCount: number;
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div className="paperus">
          <InputField
            type="text"
            data={[
              event.name ?? "Unknown",
              (value) => setEvent({ ...event, name: value ?? "Unknown" }),
            ]}
          />
        </div>
        {/* // dropzone */}
        <ItemDropZone
          catalog={catalog}
          data={[
            event.product ?? {},
            (value) => setEvent({ ...event, product: value ?? {} }),
          ]}
          dropDeps={dropDeps}
        ></ItemDropZone>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          className="history-item paperus"
          style={{
            width: "100%",
            height: "64px",
          }}
        >
          <InputField
            type="textarea"
            data={[
              event.description ?? "",
              (value) => setEvent({ ...event, description: value ?? "" }),
            ]}
          />
        </div>
        <div
          className="paperus button"
          style={{
            position: "relative",
          }}
          onClick={() =>
            setFilter({
              ...filter,
              parentID: event.ID ?? "topLevel",
            })
          }
        >
          {SubEventsCount ? (
            <div
              className="paperus"
              style={{
                position: "absolute",
                zIndex: 5,
                right: "-24px",
                top: "-24px",
              }}
            >
              {SubEventsCount}
            </div>
          ) : (
            ""
          )}
          Sub Events
        </div>
      </div>
    </div>
  );
};
