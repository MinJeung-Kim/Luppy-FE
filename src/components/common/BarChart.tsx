import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// 이미지 import
import avatar1 from "../../assets/images/avatar/avatar_1.png";
import avatar2 from "../../assets/images/avatar/avatar_2.png";
import avatar3 from "../../assets/images/avatar/avatar_3.png";
import avatar4 from "../../assets/images/avatar/avatar_4.png";
import avatar5 from "../../assets/images/avatar/avatar_5.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const images = [avatar1, avatar2, avatar3, avatar4, avatar5];

export default function BarChart() {
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadImagesAsync = async () => {
      const imagePromises = images.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        const loaded = await Promise.all(imagePromises);
        setLoadedImages(loaded);
      } catch (error) {
        console.error("이미지 로딩 실패:", error);
      }
    };

    loadImagesAsync();
  }, []);
  const data = {
    labels: ["User1", "User2", "User3", "User4", "User5"], // 5명의 사용자
    datasets: [
      {
        label: "Dataset 1",
        data: [6, 11, 7, 13, 9], // 첫 번째 막대 데이터
        backgroundColor: "#155EEF", // 진한 파란색
        barThickness: 4, // 더 얇게
        maxBarThickness: 4, // 최대 두께 제한
      },
      {
        label: "Dataset 2",
        data: [9, 12, 13, 8, 10], // 두 번째 막대 데이터
        backgroundColor: "#93C5FD", // 옅은 파란색
        barThickness: 4, // 더 얇게
        maxBarThickness: 4, // 최대 두께 제한
      },
    ],
  };

  // 커스텀 이미지 플러그인
  const xImagePlugin = {
    id: "xImagePlugin",
    afterDraw: (chart: ChartJS) => {
      const { ctx, chartArea, scales } = chart;

      if (loadedImages.length === 0) {
        console.log("이미지가 아직 로드되지 않았습니다.");
        return;
      }

      const dataLength = 5; // 5개의 이미지 표시

      for (let i = 0; i < dataLength; i++) {
        // 각 사용자의 중심점에 이미지 배치 (2개 막대의 중간)
        const x = scales.x.getPixelForTick(i);
        const y = chartArea.bottom + 8; // 차트 하단에서 8px 아래

        const img = loadedImages[i % loadedImages.length];
        const size = 30; // 이미지 크기

        // 이미지가 완전히 로드되었는지 확인
        if (img.complete && img.naturalHeight !== 0) {
          ctx.drawImage(img, x - size / 2, y, size, size);
        }
      }
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // aspect ratio 해제
    resizeDelay: 0, // 리사이즈 지연 없음
    interaction: {
      intersect: false,
    },
    layout: {
      padding: {
        bottom: 40, // 큰 이미지를 위한 하단 여백 증가
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false },
        categoryPercentage: 0.9, // 카테고리 간격 조정 (0.8 = 좁음, 1.0 = 넓음)
        barPercentage: 0.8, // 막대 간격 조정 (0.8 = 좁음, 1.0 = 넓음)
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "200px", // 고정 높이 설정
      overflow: "hidden",
      maxWidth: "100%",
      boxSizing: "border-box"
    }}>
      <Bar
        key={loadedImages.length > 0 ? "loaded" : "loading"}
        options={options}
        data={data}
        plugins={[xImagePlugin]}
      />
    </div>
  );
}
