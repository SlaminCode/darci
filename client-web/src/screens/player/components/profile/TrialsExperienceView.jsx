import React from "react";
import ProfileExperienceView from "./ProfileExperienceView";

const TrialsExperienceView = (props) => {
    const profile = props.profile;

    if (!profile) {
        return "";
    }

    const char = profile.lastActiveCharacterProfile;

    console.log(char);

    return (
        <ProfileExperienceView
            progression={char.progressions.trials}
            title="Trials"
        />
    );
};

export default TrialsExperienceView;
