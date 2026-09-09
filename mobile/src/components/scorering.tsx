import { View } from "react-native";
import Svg, { Path, Text as SvgText, G } from "react-native-svg";
import { color, font } from "../theme/tokens";

// Brand loop mark, shared with the wordmark in logo.tsx.
const MARK_PATH =
  "M254.05,150.74c6.73-4.08,13.83-11.39,14.93-19.45.83-6.1-1.67-12.28-7.06-15.42-5.29-3.08-11.75-2.27-16.72,1.1-3.53,2.4-6.12,5.49-8.77,8.8-1.03,1.29-2.44,1.98-3.98,1.82-1.68-.18-2.8-1.22-3.66-2.8l-2.57-4.73c-1.51-2.78-3.2-5.14-5.35-7.49-3.78-4.14-10.19-5.52-15.05-2.37-3.49,2.26-5.46,6.1-6.34,10.1-1.87,8.46,2.05,18.28,6.86,25.56,5.66,8.57,13.02,15.45,21.27,21.5,1.7,1.25,1.29,3.84.31,5.06-1.21,1.5-3.59,2.26-5.27.97-5.26-4.01-10.18-8.21-14.69-13.1-8.79-9.52-17.16-22.73-16.78-35.89.2-6.84,2.61-13.42,7.39-18.09,6.63-6.47,16.37-7.41,23.98-2.34,2.07,1.38,4.06,2.77,5.45,4.82l5.58,8.24c3.5-4,7.17-6.96,11.82-9.01,11.79-5.19,25.67.37,30.06,12.61,2.46,6.87,1.56,14.32-1.82,20.73-2.42,4.6-5.81,8.19-9.76,11.51l-12.86,9.04,6.74.18c2.04.05,3.19,1.8,3.3,3.56s-.79,4.15-2.96,4.16l-23.76.1c-2.5.01-4.76-1.99-4.23-4.55l3.53-17.1c.47-2.25,2.93-3.11,4.84-2.65,2.09.5,3.15,2.44,2.7,4.72l-1.85,9.34,14.72-8.94Z";

type props = {
  score: number;
  size?: number;
  strongAt?: number;
};

export function ScoreRing({ score, size = 56, strongAt = 60 }: props) {
  const textColor = score >= strongAt ? color.foreground : color.mutedForeground;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M65.05,91.35 A44,44 0 1 1 91.35,65.05" fill="none" stroke={color.border} strokeWidth={3} strokeLinecap="round" />
        <SvgText x="50" y="52" textAnchor="middle" alignmentBaseline="central" fill={textColor} fontFamily={font.display} fontWeight="700" fontSize="40">
          {score}
        </SvgText>
        <G transform="translate(21.945, 45.745) scale(0.2545)">
          <Path d={MARK_PATH} fill={color.border} />
        </G>
      </Svg>
    </View>
  );
}
