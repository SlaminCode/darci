import { calculateEfficiency, calculateKillsDeathsRatio } from "shared";
import CompactMedalsList from "../../../components/CompactMedalsList";
import StatusView from "../../../components/StatusView";
import ActivityPlayerStatsView from "./ActivityPlayerStatsView";
import PlayerInfoView from "./ActivityPlayerInfoView";
import { SMALL } from "../../../core/consts";

const rootStyle = {
  display: "grid",
  gridTemplateColumns: "200px 370px 20px auto",
  flexDirection: "row",
  alignItems: "center",
  columnGap: 12,
  //justifyContent: "center",
};

const statusViewStyle = {
  display: "flex",
  justifyContent: "center",
};

const ActivityPlayerListItemHeader = (props) => {
  const player = props.player;
  const onClick = props.onClick;

  let className = props.onClick ? "list_item_header link" : "list_item_header";

  const data = [
    { value: player.stats.score, label: "score" },
    { value: player.stats.kills, label: "kills" },
    { value: player.stats.assists, label: "assists" },
    { value: player.stats.opponentsDefeated, label: "defeats" },
    { value: player.stats.deaths, label: "deaths" },
    {
      value: calculateKillsDeathsRatio(
        player.stats.kills,
        player.stats.deaths
      ).toFixed(2),
      label: "kd",
    },
    {
      value: calculateEfficiency(
        player.stats.kills,
        player.stats.deaths,
        player.stats.assists
      ).toFixed(2),
      label: "eff",
    },
  ];

  const handleOnClick = (e) => {
    if (!onClick) {
      return;
    }

    onClick(e);
  };

  const goldMedals = player.stats.extended.medals.filter((m) => m.info.isGold);

  return (
    <div className={className} style={rootStyle} onClick={handleOnClick}>
      <PlayerInfoView player={player} />
      <ActivityPlayerStatsView data={data} />
      <div style={statusViewStyle}>
        <StatusView
          completed={player.stats.completed}
          joinedLate={player.stats.joinedLate}
        />
      </div>
      <CompactMedalsList medals={goldMedals} size={SMALL} />
    </div>
  );
};

export default ActivityPlayerListItemHeader;
