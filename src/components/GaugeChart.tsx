const lerp = (a: number, b: number, p: number) => {
  return Math.min(a * (1 - p) + b * p, b)
}

const GaugeChart = ({ data }: { data: number }) => {
  const deg = `${lerp(-172, 8, data) - (data <= 0.05 ? 0 : 8)}`

  return (
    <div className="gauge">
      <svg fill="none" viewBox="0 0 178 89" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip)">
          <path
            d="M167.692 89.0945C167.692 89.0116 167.692 88.9287 167.692 88.8458C167.692 45.3005 132.392 10 88.8462 10C45.3006 10 10 45.3005 10 88.8458C10 88.9287 10.0002 89.0116 10.0004 89.0945"
            strokeWidth="20"
            stroke="var(--extra-light)"
          />
          <path
            d="M167.692 89.0945C167.692 89.0116 167.692 88.9287 167.692 88.8458C167.692 45.3005 132.392 10 88.8461 10C45.3006 10 10 45.3005 10 88.8458C10 88.9287 10.0002 89.0116 10.0004 89.0945"
            strokeLinecap="round"
            strokeWidth="20"
            stroke="#33DB76"
            style={{ transformOrigin: "bottom center", transform: `rotate(${deg}deg)` }}
          />
        </g>
        <defs>
          <clipPath id="clip">
            <rect width="178" height="89" fill="transparent" />
          </clipPath>
        </defs>
      </svg>
      <div className="value">
        {Math.max(Math.min(Math.round(data * 100), 100), 0)}
        <span>/ 100</span>
      </div>
      <div className="labels">
        <span>😡</span>
        <span>🥰</span>
      </div>
    </div>
  )
}

export default GaugeChart
