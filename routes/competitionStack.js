import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from 'react-navigation';
import Competition from '../screens/competition/competition';
import CompetitionDetails from '../screens/competition/competitionDetails';


const screens = {
    Contests: {
        screen: Competition
    },
    ContestDetails: {
        screen: CompetitionDetails 
    }
}
const CompetitionStack = createStackNavigator(screens);

export default createAppContainer(CompetitionStack);