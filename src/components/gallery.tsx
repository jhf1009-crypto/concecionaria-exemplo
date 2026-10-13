"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowLeft, ArrowRight, Expand, ZoomIn, Share2 } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
export function Gallery({ vehicle }: { vehicle: Vehicle }) {
  const [index, setIndex] = useState(0),
    [zoom, setZoom] = useState(false),
    [shared, setShared] = useState("");
  const start = useRef(0);
  const current = vehicle.gallery[index];
  function move(offset: number) {
    setIndex(
      (i) => (i + offset + vehicle.gallery.length) % vehicle.gallery.length,
    );
    setZoom(false);
  }
  return (
    <div className="gallery">
      <Dialog.Root onOpenChange={() => setZoom(false)}>
        <Dialog.Trigger asChild>
          <button
            className="gallery-main"
            aria-label="Abrir galeria de fotografias"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 850px) 100vw, 65vw"
              priority
            />
            <span>
              <Expand size={17} />
              Ampliar fotos
            </span>
          </button>
        </Dialog.Trigger>
        <div className="gallery-thumbs">
          {vehicle.gallery.map((photo, i) => (
            <button
              key={photo.src}
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}: ${photo.alt}`}
              aria-pressed={index === i}
            >
              <Image src={photo.src} alt="" fill sizes="160px" />
            </button>
          ))}
          <span>
            {index + 1} / {vehicle.gallery.length}
          </span>
        </div>
        <p className="fine-print">
          {current.alt}. As fotos não documentam uma unidade à venda.
        </p>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay gallery-overlay" />
          <Dialog.Content
            className="gallery-lightbox"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") move(-1);
              if (e.key === "ArrowRight") move(1);
            }}
          >
            <Dialog.Title className="sr-only">
              Galeria: {vehicle.brand} {vehicle.model}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Use as setas para navegar, o botão de zoom para ampliar e Escape
              para fechar.
            </Dialog.Description>
            <Dialog.Close
              className="lightbox-close icon-button"
              aria-label="Fechar galeria"
            >
              <X />
            </Dialog.Close>
            <div
              className={`lightbox-image ${zoom ? "zoomed" : ""}`}
              onTouchStart={(e) => (start.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - start.current;
                if (Math.abs(delta) > 50) move(delta > 0 ? -1 : 1);
              }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="lightbox-controls">
              <button
                className="icon-button"
                aria-label="Foto anterior"
                onClick={() => move(-1)}
              >
                <ArrowLeft />
              </button>
              <span>
                {index + 1} / {vehicle.gallery.length}
              </span>
              <button
                className="icon-button"
                aria-label="Próxima foto"
                onClick={() => move(1)}
              >
                <ArrowRight />
              </button>
              <button
                className="icon-button"
                aria-label={zoom ? "Reduzir foto" : "Ampliar foto"}
                aria-pressed={zoom}
                onClick={() => setZoom(!zoom)}
              >
                <ZoomIn />
              </button>
            </div>
            <p>{current.alt}</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <button
        className="text-button share-button"
        onClick={async () => {
          try {
            if (navigator.share)
              await navigator.share({
                title: `${vehicle.brand} ${vehicle.model} — Ninho Veículos`,
                url: location.href,
              });
            else {
              await navigator.clipboard.writeText(location.href);
              setShared("Link copiado!");
            }
          } catch {
            setShared("Use o endereço desta página para compartilhar.");
          }
        }}
      >
        <Share2 size={16} />
        Compartilhar veículo
      </button>
      <span className="small" role="status">
        {shared}
      </span>
    </div>
  );
}
