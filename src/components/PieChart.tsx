import { useRef, useEffect } from "react"
import { Chart, PieController, ArcElement, Tooltip } from "chart.js"
import randomColor from "../utils/colors"
import { Data } from "../constants/chatter"

Chart.register(PieController, ArcElement, Tooltip)

const PieChart = ({ data }: { data: Data[] }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = new Chart(ref.current, {
        type: "pie",
        options: {
          plugins: {
            tooltip: {
              displayColors: false
            }
          }
        },
        data: {
          labels: data.map((d) => d.content),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: randomColor({ count: data.length }),
              hoverOffset: 0
            }
          ]
        }
      })
    }
  }, [ref])

  return <canvas ref={ref} width="400" height="400"></canvas>
}

export default PieChart
