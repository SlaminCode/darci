/* MIT License
 *
 * Copyright (c) 2022 Mike Chambers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from "react";

import PlayerInfoView from "./ActivityPlayerInfoView";
import PlayerActivityDetailListItemHeader from "../../../components/PlayerActivityDetailListItemHeader";
import DetailListIndicatorView from "./DetailListIndicatorView";

const ActivityPlayerListItemHeader = (props) => {
    const player = props.player;
    const teamColor = props.teamColor;
    const topStats = props.topStats;

    let teamStyleColor = teamColor ? teamColor : "#00000000";

    return (
        <PlayerActivityDetailListItemHeader player={player} topStats={topStats}>
            <DetailListIndicatorView
                color={teamStyleColor}
                description="Fireteam"
            />
            <PlayerInfoView player={player} />
        </PlayerActivityDetailListItemHeader>
    );
};

export default ActivityPlayerListItemHeader;
