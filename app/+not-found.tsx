import { Link, Stack } from "expo-router";
import { View, StyleSheet} from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{title: 'Oops! Not Found'}} />
            <View>
                <Link href="/">
                    Go back to home screen
                </Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    button: {
        fontSize:20,
        textDecorationLine: 'underline',
        color:'#fff',
    }
})