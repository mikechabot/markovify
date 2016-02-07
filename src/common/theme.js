import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Raleway, sans-serif',
  palette: {
    primary1Color: Colors.indigo700,
    primary2Color: Colors.indigo500,
    primary3Color: Colors.indigo100,
    accent1Color: Colors.grey600,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.grey600,
    alternateTextColor: Colors.grey300,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.indigo500,
  }
};