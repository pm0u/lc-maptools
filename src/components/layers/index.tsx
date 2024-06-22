"use client";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Card } from "@/components/card";
import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";

export const Layers = () => {
  const { layers, isLayerVisible, toggleLayer } = useMapboxMapContext();

  return (
    <Card position="left">
      <div className="flex flex-col">
        {layers.map((layerId) => (
          <div
            key={layerId}
            className="flex items-center justify-between border-b border-base-200 py-2 first:border-t"
          >
            <span>{layerId}</span>
            <button
              onClick={() => {
                toggleLayer(layerId);
              }}
            >
              {isLayerVisible(layerId) ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};
