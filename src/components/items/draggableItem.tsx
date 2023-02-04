import { useDrag } from "react-dnd";

export enum ItemTypes {
  LOOT = "loot",
}

export const DraggableItem = ({
  onClick,
  style,
  children,
  data,
  type = ItemTypes.LOOT,
}: {
  onClick: () => void;
  style: any;
  children?: any;
  data: any;
  type: ItemTypes;
}) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type,
      item: data,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );
  return (
    <div
      ref={dragRef}
      className="paperus button"
      style={{ ...style, opacity }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
