const Loading = () => {
  return (
    <svg className="loader" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 33 33;270 33 33"
          begin="0s"
          dur="1.4s"
          fill="freeze"
          repeatCount="indefinite"
        />
        <circle
          fill="none"
          strokeWidth="5"
          cx="33"
          cy="33"
          r="30"
          strokeDasharray="187"
          strokeDashoffset="610"
          stroke="#000"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 33 33;135 33 33;450 33 33"
            begin="0s"
            dur="1.4s"
            fill="freeze"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="167;46.75;167"
            begin="0s"
            dur="1.4s"
            fill="freeze"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  )
}

export default Loading
