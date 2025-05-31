import { NavigatorScreenParams, ParamListBase } from '@react-navigation/native';

export interface TabParamList extends ParamListBase {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Settings: undefined;
};

export interface HomeStackParamList extends ParamListBase {
  Index: undefined;
  EditCar: undefined;
  Records: undefined;
  EditRecord: undefined;
};
