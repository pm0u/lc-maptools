import { useLayerOpacity } from "@/hooks/use-layer-opacity";
import { throttle } from "lodash";
import { ChangeEvent, useMemo } from "react";

export const OpacitySlider = ({ layerId }: { layerId: string }) => {
  const { ready, opacity, setOpacity, error } = useLayerOpacity(layerId);

  const onChange = useMemo(
    () =>
      throttle((e: ChangeEvent<HTMLInputElement>) => {
        const newOpacity = parseFloat(e.target.value);
        setOpacity(newOpacity);
      }, 50),
    [setOpacity]
  );

  if (error) {
    console.error(error);
    return <></>;
  }

  return (
    <input
      type="range"
      max={100}
      min={0}
      step={1}
      value={opacity !== null ? opacity : 0}
      className="range range-xs w-full ml-auto "
      disabled={!ready}
      onChange={onChange}
    />
  );
};
