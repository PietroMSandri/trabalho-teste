import { Text, View ,StyleSheet } from "react-native";


export default function AboutScreen() {
  return (
    <View style = {styles.container}>
       <View style={styles.box}>
      <Text style = {styles.text}>🔹 Opel Manta 400

Lançado em 1983, baseado no cupê Opel Manta B{"\n"} Equipado com um motor 2.4 litros 4 cilindros, com cerca de 275 a 300 cv nas versões de competição{"\n"}

Tração traseira (RWD) — o que o colocava em desvantagem frente aos rivais com tração integral, como o Audi Quattro{"\n"}

Apesar disso, ficou famoso pela excelente dirigibilidade, equilíbrio de chassi e pilotagem precisa.</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#134761',
  justifyContent: "center",
  alignItems: "center",
},
  text: {
    color: '#ffff',
    fontSize: 20,
  },

  box: {
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20, 
  },
})