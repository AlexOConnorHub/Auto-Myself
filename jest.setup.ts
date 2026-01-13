import 'whatwg-fetch';
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
import mockReanimatedMock from 'react-native-reanimated/mock';
jest.mock('react-native-reanimated', () => mockReanimatedMock);
