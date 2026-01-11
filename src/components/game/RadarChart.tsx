import { PsychReport } from '@/types/game';

interface RadarChartProps {
  data: PsychReport['radarData'];
}

export const RadarChart = ({ data }: RadarChartProps) => {
  const dimensions = [
    { key: 'speed', label: '速度', angle: -90 },
    { key: 'accuracy', label: '准确', angle: -18 },
    { key: 'stability', label: '稳定', angle: 54 },
    { key: 'focus', label: '专注', angle: 126 },
    { key: 'resilience', label: '韧性', angle: 198 },
  ];

  const size = 200;
  const center = size / 2;
  const maxRadius = 80;

  // 生成雷达图的点
  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * maxRadius;
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // 生成多边形路径
  const polygonPoints = dimensions
    .map((dim) => {
      const point = getPoint(data[dim.key as keyof typeof data], dim.angle);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  // 生成背景网格
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* 背景网格 */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={dimensions
            .map((dim) => {
              const point = getPoint(level, dim.angle);
              return `${point.x},${point.y}`;
            })
            .join(' ')}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
      ))}

      {/* 轴线 */}
      {dimensions.map((dim) => {
        const endPoint = getPoint(100, dim.angle);
        return (
          <line
            key={dim.key}
            x1={center}
            y1={center}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据区域 */}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary) / 0.3)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />

      {/* 数据点 */}
      {dimensions.map((dim) => {
        const point = getPoint(data[dim.key as keyof typeof data], dim.angle);
        return (
          <circle
            key={dim.key}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="hsl(var(--primary))"
          />
        );
      })}

      {/* 标签 */}
      {dimensions.map((dim) => {
        const labelPoint = getPoint(120, dim.angle);
        return (
          <text
            key={dim.key}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-foreground"
          >
            {dim.label}
          </text>
        );
      })}
    </svg>
  );
};
