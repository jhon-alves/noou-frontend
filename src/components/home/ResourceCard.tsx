import { Card } from "../ui/card"

interface ResourceCardProps {
  title: string
  description: string
  tag: string
  category: "help" | "community"
  onClick: () => void
}

export function ResourceCard({ title, description, tag, category, onClick }: ResourceCardProps) {
  return (
    <Card className="relative h-92.75 cursor-pointer" onClick={onClick}>
      <div className="relative h-full flex flex-col gap-9 p-8">
        {/* Content Wrapper */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Badge */}
          <div className="flex h-7.25 items-center px-3 rounded-[60px] self-start relative">
            <div
              aria-hidden="true"
              className="absolute border border-solid border-[#111827] dark:border-white/30 inset-0 pointer-events-none rounded-[60px]"
            />
            <p className="text-[#111827] dark:text-white text-sm leading-4.5 relative">{tag}</p>
          </div>

          {/* Title and Description */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#111827] dark:text-white text-[18px] leading-6.75 font-semibold font-['Manrope']">
              {title}
            </h3>
            <p className="text-[#666f8d] dark:text-white/70 text-[14px] leading-5.25 font-['Manrope']">
              {description}
            </p>
          </div>
        </div>

        {/* SVG Pattern */}
        {category === "help" && (
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-0 place-items-start relative shrink-0">
            <div className="[grid-area:1/1] h-[394.711px] ml-0 mt-0 relative w-98.75">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 395 394.711"
              >
                <path
                  d="M395 394.711H0V0H394.711V394.711H395ZM2.89165 391.819H391.819V2.89165H2.89165V391.819Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] h-[393.554px] ml-[0.37%] mt-0 relative w-[393.265px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 393.265 393.554"
              >
                <path
                  d="M390.663 393.554L326.179 67.3756L0 2.89165L0.289183 0L328.492 64.7731L328.781 65.9297L393.265 392.976L390.663 393.554Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] ml-[0.22%] mt-0 relative size-[393.843px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 393.843 393.843"
              >
                <path
                  d="M391.241 393.843L261.406 132.727L0 2.60252L1.44583 0L263.43 130.414L263.719 130.992L393.843 392.687L391.241 393.843Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] h-[393.843px] ml-[0.15%] mt-[0.07%] relative w-[394.133px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 394.133 393.843"
              >
                <path
                  d="M391.819 393.843L221.79 172.343L0 2.31333L2.02419 0L223.814 170.318L394.133 392.108L391.819 393.843Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] ml-[0.15%] mt-[0.15%] relative size-[393.843px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 393.843 393.843"
              >
                <path
                  d="M392.108 393.843L170.029 223.525L0 1.73497L2.02419 0L172.343 221.501L393.843 391.53L392.108 393.843Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] h-[393.554px] ml-[0.07%] mt-[0.22%] relative w-[393.843px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 393.843 393.554"
              >
                <path
                  d="M392.398 393.554L130.414 263.141L130.124 262.851L0 1.15669L2.60247 0L132.727 261.116L393.843 390.952L392.398 393.554Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
            <div className="[grid-area:1/1] ml-[0.07%] mt-[0.29%] relative size-[393.554px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 393.554 393.554"
              >
                <path
                  d="M392.976 393.554L64.773 328.492L64.4839 327.624L0 0.578322L2.60247 0L67.0864 326.179L393.554 390.663L392.976 393.554Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </svg>
            </div>
          </div>
        )}
        {category === "community" && (
          <div className="h-[395.369px] relative shrink-0 w-98.5">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 394 395.369"
            >
              <g>
                <g>
                  <path
                    d="M394 395.369H0V1.36875H394V395.369ZM2.28273 392.63H391.261V3.65148H2.28273V392.63Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M196.772 204.989L0 3.65148L1.8263 1.36875L196.772 200.88L391.717 1.36875L393.544 3.65148L196.772 204.989Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M391.717 394.913L196.772 204.99L1.8263 394.913L0 393.087L196.772 200.881L197.685 201.794L393.544 393.087L391.717 394.913Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M392.63 196.772H0.91315V199.512H392.63V196.772Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M198.142 2.73973H195.402V394.457H198.142V2.73973Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M1.36959 285.798L0.456436 283.059L196.315 197.228L392.174 107.289L393.087 109.571L197.228 199.511L1.36959 285.798Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M392.174 285.798L196.315 199.511L0.456436 109.571L1.8263 107.289L197.228 197.228L393.087 283.059L392.174 285.798Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M110.028 392.631L107.745 391.718L197.228 195.859L283.516 0.456993L285.798 1.37L199.968 197.229L110.028 392.631Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                  <path
                    d="M283.516 392.63L197.228 197.228L107.745 1.36959L110.028 0L199.968 195.859L285.798 391.717L283.516 392.63Z"
                    className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                  />
                </g>
                <path
                  d="M257.949 136.964H135.138V259.775H257.949V136.964Z"
                  className="fill-[#E5E5E5] dark:fill-[#181F2F]"
                />
              </g>
            </svg>
          </div>
        )}
      </div>
    </Card>
  )
}
