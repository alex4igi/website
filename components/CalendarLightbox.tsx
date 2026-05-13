'use client'

import { useState } from 'react'
import { Calendar, Minus, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CalendarLightboxProps {
  src: string
  alt?: string
  title?: string
  triggerLabel?: string
  className?: string
}

const ZOOM_STEP = 0.25
const ZOOM_MIN = 0.5
const ZOOM_MAX = 3

export default function CalendarLightbox({
  src,
  alt = 'Calendar Quasar Dance',
  title = 'Calendar cursuri',
  triggerLabel = 'Vezi calendar',
  className,
}: CalendarLightboxProps) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setZoom(1)
  }

  const zoomIn = () => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX))
  const zoomOut = () => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN))
  const reset = () => setZoom(1)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'inline-flex items-center gap-2 bg-[#231f20] text-[#f8ef21] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#3a3637] transition-all'
        }
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Calendar size={16} />
        {triggerLabel}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="!max-w-[min(95vw,1400px)] w-[95vw] !p-0 !gap-0 h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="!flex-row items-center justify-between gap-3 px-5 py-3 border-b border-[#e5e5e5] !text-left">
            <DialogTitle
              className="text-[#231f20] text-base font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </DialogTitle>
            <div className="flex items-center gap-1 mr-8 sm:mr-10">
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
                disabled={zoom <= ZOOM_MIN}
                className="p-2 rounded-md hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="Resetează zoom"
                className="px-3 py-1.5 rounded-md hover:bg-[#f5f5f5] text-xs font-bold tabular-nums min-w-[58px] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
                disabled={zoom >= ZOOM_MAX}
                className="p-2 rounded-md hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-[#f5f5f5] p-3 md:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="block select-none mx-auto"
              style={{
                width: `${zoom * 100}%`,
                maxWidth: 'none',
                height: 'auto',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
