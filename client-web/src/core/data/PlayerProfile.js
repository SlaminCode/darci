/* MIT License
 *
 * Copyright (c) 2023 Mike Chambers
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

import { CharacterClass, Mode } from "shared";

//const GLORY_PROGRESSION_ID = "1647151960";
const COMP_PROGRESSION_ID = "3696598664";
const VALOR_PROGRESSION_ID = "2083746873";
const TRIALS_PROGRESSION_ID = "2755675426";
const IRON_BANNER_PROGRESSION_ID = "599071390";
export const MERCY_PASSAGE_ID = 1600065451;

//const GLORY_STREAK_ID = "2572719399";
const VALOR_STREAK_ID = "2203850209";

//IB streak? 4271189086

/*
                        "599071390": {
                            "progressionHash": 599071390,
                            "dailyProgress": 669,
                            "dailyLimit": 0,
                            "weeklyProgress": 669,
                            "weeklyLimit": 0,
                            "currentProgress": 3722,
                            "level": 9,
                            "levelCap": 16,
                            "stepIndex": 9,
                            "progressToNextLevel": 372,
                            "nextLevelAt": 525,
                            "currentResetCount": 2
                        },
*/

/*
const TRIALS_WINS_ID = "1062449239";
const TRIALS_LOSSES_ID = "2093709363";
const TRIALS_ROUNDS_WON_ID = "3497267100";
const FLAWLESS_ID = "1349727737";
*/

const TRIALS_WINS_ID = 1586211619;
const TRIALS_LOSSES_ID = 2369244651;
const TRIALS_ROUNDS_WON_ID = 984122744;
const TRIALS_FLAWLESS_ID = 2211480687;

const parseCharacterFromProfile = (data, manifest) => {
    let emblem = manifest.getEmblemDefinition(data.emblemHash);

    let character = {
        characterId: data.characterId,
        classType: CharacterClass.fromId(data.classType),
        lightLevel: data.light,
        dateLastPlayed: new Date(Date.parse(data.dateLastPlayed)),
        emblem: emblem,
    };

    return character;
};

class PlayerProfile {
    //#data;
    #characterProfiles;
    #lastActiveCharacterProfile;
    #currentActivity;

    #timestamp;
    #secondaryTimestamp;

    constructor(data, manifest) {
        this.#timestamp = new Date(data.responseMintedTimestamp);
        this.#secondaryTimestamp = new Date(
            data.secondaryComponentsMintedTimestamp
        );

        let lastActiveCharacterProfile = undefined;
        this.#characterProfiles = [];

        for (const cId in data.characters.data) {
            let progressions =
                data.characterProgressions.data[cId].progressions;

            let valor = {};
            //let glory = {};
            let ironBanner = {};
            let trials = {};
            let competitive = {};

            if (progressions) {
                const valorProgression = progressions[VALOR_PROGRESSION_ID];

                let step = manifest.getProgressionStep(
                    VALOR_PROGRESSION_ID,
                    valorProgression.level
                );

                valor = {
                    level: valorProgression.level,
                    currentProgress: valorProgression.currentProgress,
                    nextLevelAt: valorProgression.nextLevelAt,
                    progressToNextLevel: valorProgression.progressToNextLevel,
                    streak: progressions[VALOR_STREAK_ID].currentProgress,
                    resets: valorProgression.currentResetCount,
                    step,
                };

                const compProgression = progressions[COMP_PROGRESSION_ID];

                step = manifest.getProgressionStep(
                    COMP_PROGRESSION_ID,
                    compProgression.level
                );

                competitive = {
                    level: compProgression.level,
                    currentProgress: compProgression.currentProgress,
                    nextLevelAt: compProgression.nextLevelAt,
                    progressToNextLevel: compProgression.progressToNextLevel,
                    step,
                };

                const ironBannerProgression =
                    progressions[IRON_BANNER_PROGRESSION_ID];

                step = manifest.getProgressionStep(
                    IRON_BANNER_PROGRESSION_ID,
                    ironBannerProgression.level
                );

                ironBanner = {
                    level: ironBannerProgression.level,
                    currentProgress: ironBannerProgression.currentProgress,
                    nextLevelAt: ironBannerProgression.nextLevelAt,
                    progressToNextLevel:
                        ironBannerProgression.progressToNextLevel,
                    resets: ironBannerProgression.currentResetCount,
                    step,
                };

                let trialsPassageIds = manifest.trialsPassageIds;

                let currentCard;
                const uninstancedItemObjectives =
                    data.characterProgressions.data[cId][
                        "uninstancedItemObjectives"
                    ];
                for (const id of trialsPassageIds) {
                    //This is an Array of objects
                    let trialsData = uninstancedItemObjectives[id];
                    if (!uninstancedItemObjectives[id]) {
                        continue;
                    }

                    let wins;
                    let losses;
                    let roundsWon;
                    let isFlawless;

                    for (const obj of trialsData) {
                        switch (obj.objectiveHash) {
                            case TRIALS_WINS_ID:
                                wins = obj.progress;
                                break;
                            case TRIALS_LOSSES_ID:
                                losses = obj.progress;
                                break;
                            case TRIALS_ROUNDS_WON_ID:
                                roundsWon = obj.progress;
                                break;
                            case TRIALS_FLAWLESS_ID:
                                isFlawless = obj.progress === 1;
                                break;
                            default:
                        }
                    }

                    const passage = manifest.getTrialsPassageDefinition(id);

                    let hasMercy = false;
                    let showMercy = false;
                    if (id === MERCY_PASSAGE_ID) {
                        const uninstancedItemPerks =
                            data.characterProgressions.data[cId][
                                "uninstancedItemPerks"
                            ];

                        if (
                            uninstancedItemPerks &&
                            uninstancedItemPerks[MERCY_PASSAGE_ID]
                        ) {
                            const perks =
                                uninstancedItemPerks[MERCY_PASSAGE_ID].perks;

                            for (const p of perks) {
                                //Forgives one loss per run
                                if (p.perkHash === 989028955) {
                                    hasMercy = p.visible;
                                    showMercy = true;
                                }

                                /*
                                if (p.perkHash === 1349727737) {
                                    //Loss Has Been Forgiven
                                    hasMercy = !p.visible;
                                    showMercy = true;
                                }
                                */
                            }
                        }
                    }

                    currentCard = {
                        wins,
                        losses,
                        roundsWon,
                        isFlawless,
                        passage,
                        showMercy,
                        hasMercy,
                    };
                }

                const trialsProgression = progressions[TRIALS_PROGRESSION_ID];
                step = manifest.getProgressionStep(
                    TRIALS_PROGRESSION_ID,
                    trialsProgression.level
                );
                trials = {
                    level: trialsProgression.level,
                    currentProgress: trialsProgression.currentProgress,
                    nextLevelAt: trialsProgression.nextLevelAt,
                    progressToNextLevel: trialsProgression.progressToNextLevel,
                    resets: trialsProgression.currentResetCount,
                    currentCard,
                    step,
                };
            }

            let char = data.characters.data[cId];

            let character = parseCharacterFromProfile(char, manifest);

            let out = {
                character: character,
                progressions: {
                    trials,
                    valor,
                    competitive,
                    ironBanner,
                },
            };

            this.#characterProfiles.push(out);

            if (
                !lastActiveCharacterProfile ||
                out.character.dateLastPlayed.getTime() >
                    lastActiveCharacterProfile.character.dateLastPlayed.getTime()
            ) {
                lastActiveCharacterProfile = out;
            }
        }

        this.#lastActiveCharacterProfile = lastActiveCharacterProfile;

        //const profileTransitoryData = data.profileTransitoryData;

        //************ parse current activity info *****************//
        if (!lastActiveCharacterProfile) {
            return;
        }

        const characterActivities = data.characterActivities.data; //obj
        const currentChar = lastActiveCharacterProfile.character;
        const currentCharData = characterActivities[currentChar.characterId];

        const currentActivityModeTypes =
            currentCharData.currentActivityModeTypes;

        if (
            !currentActivityModeTypes ||
            !(
                currentActivityModeTypes.includes(Mode.ALL_PVP.id) ||
                currentActivityModeTypes.includes(Mode.PRIVATE_MATCHES_ALL.id)
            )
        ) {
            //NOTE: will fail if modes data is wrong. could go off of mode and manually check it in our code
            //not a PVP activity
            return;
        }

        const modes = currentActivityModeTypes.map((e) => Mode.fromId(e));

        const currentModeId = currentCharData.currentActivityModeType;
        let mode = Mode.fromId(currentModeId);

        const location = manifest.getActivityDefinition(
            currentCharData.currentActivityHash
        );

        const playlist = manifest.getActivityDefinition(
            currentCharData.currentPlaylistActivityHash
        );

        const modeInfo = manifest.getModeInfo(mode);

        this.#currentActivity = {
            character: currentChar,
            mode,
            modeInfo,
            modes,
            location,
            playlist,
        };
    }

    get currentActivity() {
        return this.#currentActivity;
    }

    get lastActiveCharacterProfile() {
        return this.#lastActiveCharacterProfile;
    }

    get charactersProfiles() {
        return this.#characterProfiles;
    }

    get member() {
        return undefined;
    }

    get timestamp() {
        return this.#timestamp;
    }

    get secondaryTimestamp() {
        return this.#secondaryTimestamp;
    }
}

export default PlayerProfile;
