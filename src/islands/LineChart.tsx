/** @jsx h **/
import { h } from "preact"
import { useRef, useEffect } from "preact/hooks"
import { Data } from "../utils/chatter.ts"
import "charts-date-adapter"
import {
  Chart,
  LineController,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
} from "charts"

Chart.register(
  LineController,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
)

const LineChart = ({ data }: { data: Data[] }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = new Chart(ref.current, {
        type: "line",
        options: {
          maintainAspectRatio: false,
          responsive: true,
          elements: {
            line: {
              fill: true,
              backgroundColor: "#2196f3"
            }
          },
          plugins: {
            tooltip: {
              displayColors: false
            }
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
                tooltipFormat: "MMMM, yyyy"
              },
              min: data[0].content
            }
          }
        },
        data: {
          datasets: [
            {
              data: data.map((d) => ({ x: new Date(d.content), y: d.value })),
              fill: false,
              borderColor: "#418bfa",
              pointHitRadius: 20,
              tension: 0.35
            }
          ]
        }
      })
    }
  }, [ref])

  return <canvas ref={ref} width="400" height="800"></canvas>
}

export default LineChart
