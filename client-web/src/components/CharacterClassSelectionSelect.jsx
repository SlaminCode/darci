import { CharacterClassSelection } from "shared";
import EnumSelect from "./EnumSelect";

const classes = [
  CharacterClassSelection.ALL,
  CharacterClassSelection.HUNTER,
  CharacterClassSelection.TITAN,
  CharacterClassSelection.WARLOCK,
];

const CharacterClassSelectionSelect = (props) => {
  const onChange = props.onChange;
  const selected = props.selected;
  const maxLabelLength = props.maxLabelLength;
  const label = props.label ? props.label : "";
  const disabled = props.disabled;

  return (
    <EnumSelect
      onChange={onChange}
      options={classes}
      selected={selected}
      label={label}
      maxLabelLength={maxLabelLength}
      disabled={disabled}
    />
  );
};

export default CharacterClassSelectionSelect;
