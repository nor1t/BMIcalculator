import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert
} from 'react-native';

export default function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [isMetric, setIsMetric] = useState(true);
  const [history, setHistory] = useState([]);

  const calculateBMI = () => {
    let heightValue = parseFloat(height);
    let weightValue = parseFloat(weight);
    
    if (!height || !weight) {
      alert('Të lutem vendos gjatësinë dhe peshën!');
      return;
    }
    
    if (isNaN(heightValue) || isNaN(weightValue)) {
      alert('Të lutem vendos numra real!');
      return;
    }
    
    
    if (isMetric) {
      
      if (heightValue <= 50 || heightValue >= 250) {
        alert('Gjatësia duhet të jetë ndërmjet 50cm dhe 250cm!');
        return;
      }
      if (weightValue <= 10 || weightValue >= 300) {
        alert('Pesha duhet të jetë ndërmjet 10kg dhe 300kg!');
        return;
      }
    } else {
      
      if (heightValue <= 20 || heightValue >= 100) {
        alert('Gjatësia duhet të jetë ndërmjet 20in dhe 100in!');
        return;
      }
      if (weightValue <= 22 || weightValue >= 660) {
        alert('Pesha duhet të jetë ndërmjet 22lb dhe 660lb!');
        return;
      }
    }

    let heightInMeters, weightInKg;
    
    if (isMetric) {
      heightInMeters = heightValue / 100;
      weightInKg = weightValue;
    } else {
      heightInMeters = heightValue * 0.0254; 
      weightInKg = weightValue * 0.453592; 
    }

    const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(calculatedBmi);
    
    if (calculatedBmi < 18.5) {
      setBmiCategory('Nënpeshë');
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setBmiCategory('Peshë normale');
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setBmiCategory('Mbipeshë');
    } else {
      setBmiCategory('Obez');
    }
    
    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('sq-AL'),
      bmi: calculatedBmi,
      category: calculatedBmi < 18.5 ? 'Nënpeshë' : 
                calculatedBmi >= 18.5 && calculatedBmi < 25 ? 'Peshë normale' :
                calculatedBmi >= 25 && calculatedBmi < 30 ? 'Mbipeshë' : 'Obez',
      height: isMetric ? `${heightValue} cm` : `${heightValue} in`,
      weight: isMetric ? `${weightValue} kg` : `${weightValue} lb`
    };
    
    setHistory([newHistoryEntry, ...history.slice(0, 4)]); 
    
    Keyboard.dismiss();
  };

  const resetFields = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  const toggleUnits = () => {
    setIsMetric(!isMetric);
    resetFields();
  };

  const clearHistory = () => {
    Alert.alert(
      "Pastro historinë",
      "Jeni të sigurtë që doni të pastroni të gjitha regjistrimet?",
      [
        { text: "Jo", style: "cancel" },
        { text: "Po", onPress: () => setHistory([]) }
      ]
    );
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Nënpeshë': return '#3498db'; 
      case 'Peshë normale': return '#2ecc71'; 
      case 'Mbipeshë': return '#f39c12'; 
      case 'Obez': return '#e74c3c'; 
      default: return '#95a5a6'; 
    }
  };

  const getHealthTips = (category) => {
    switch(category) {
      case 'Nënpeshë':
        return [
          "Konsumoni më shumë kalori nga ushqime të shëndetshme",
          "Ushtroni për të ndërtuar muskuj",
          "Konsultohuni me një nutricionist për një dietë të balancuar"
        ];
      case 'Peshë normale':
        return [
          "Vazhdoni me ushqimin dhe ushtrimet aktuale",
          "Ruani një dietë të balancuar dhe të shëndetshme",
          "Kryeni ushtrime të rregullta për të ruar shëndetin"
        ];
      case 'Mbipeshë':
        return [
          "Zvogëloni kaloritë dhe ushqimet e pasura në yndyrë",
          "Rrisni aktivitetin fizik në të paktën 30 minuta në ditë",
          "Konsumoni më shumë fruta dhe perime"
        ];
      case 'Obez':
        return [
          "Kërkoni këshillë nga një mjek ose nutricionist",
          "Filloni një program ushtrimesh të përshtatshëm",
          "Ndjekni një dietë të kontrolluar kalorish me ndihmën e ekspertit"
        ];
      default:
        return [];
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Kalkulatori i BMI-së</Text>
          
          {/* Units Toggle */}
          <TouchableOpacity style={styles.unitToggle} onPress={toggleUnits}>
            <Text style={styles.unitToggleText}>
              {isMetric ? '🇦🇱 Metrikë (cm/kg)' : '🇺🇸 Imperiale (in/lb)'}
            </Text>
            <Text style={styles.unitToggleHint}>Klikoni për të ndryshuar</Text>
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Gjatësia ({isMetric ? 'cm' : 'in'})
            </Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder={isMetric ? "Vendos gjatësinë në cm" : "Vendos gjatësinë në inç"}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Pesha ({isMetric ? 'kg' : 'lb'})
            </Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder={isMetric ? "Vendos peshën në kg" : "Vendos peshën në paund"}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.calculateButton} 
            onPress={calculateBMI}
          >
            <Text style={styles.buttonText}>Kalkulo BMI-në</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetFields}
          >
            <Text style={styles.resetButtonText}>Ristarto</Text>
          </TouchableOpacity>
          
          {bmi && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>BMI-ja jote: {bmi}</Text>
              <Text style={[
                styles.categoryText, 
                { color: getCategoryColor(bmiCategory) }
              ]}>
                {bmiCategory}
              </Text>
              
              {/* Health Tips */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Këshilla shëndetësore:</Text>
                {getHealthTips(bmiCategory).map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.bmiScale}>
                <View style={styles.scaleItem}>
                  <Text style={styles.scaleLabel}>Nënpeshë</Text>
                  <Text style={styles.scaleRange}>&lt; 18.5</Text>
                </View>
                <View style={styles.scaleItem}>
                  <Text style={styles.scaleLabel}>Peshë normale</Text>
                  <Text style={styles.scaleRange}>18.5 - 24.9</Text>
                </View>
                <View style={styles.scaleItem}>
                  <Text style={styles.scaleLabel}>Mbipeshë</Text>
                  <Text style={styles.scaleRange}>25 - 29.9</Text>
                </View>
                <View style={styles.scaleItem}>
                  <Text style={styles.scaleLabel}>Obez</Text>
                  <Text style={styles.scaleRange}>&ge; 30</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* History Section */}
          {history.length > 0 && (
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Historiku i llogaritjeve</Text>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.clearHistoryText}>Pastro</Text>
                </TouchableOpacity>
              </View>
              {history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyDateContainer}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={[
                      styles.historyCategory,
                      { color: getCategoryColor(item.category) }
                    ]}>
                      {item.category}
                    </Text>
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyBmi}>BMI: {item.bmi}</Text>
                    <Text style={styles.historyMeasurements}>
                      {item.height} / {item.weight}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          <StatusBar style="light" />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#383737ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#383737ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  unitToggle: {
    backgroundColor: '#2c2b2b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  unitToggleText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unitToggleHint: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c2b2b',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#555',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#0084ffff',
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#2c2b2b',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    color: '#ffffffff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  bmiScale: {
    width: '100%',
    backgroundColor: '#2c2b2b',
    borderRadius: 10,
    padding: 15,
  },
  scaleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  scaleLabel: {
    color: 'white',
    fontSize: 16,
  },
  scaleRange: {
    color: '#ffffffff',
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 40,
    width: '100%',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  clearHistoryText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#2c2b2b',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDateContainer: {
    flex: 1,
  },
  historyDate: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  historyCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  historyBmi: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyMeasurements: {
    color: '#aaa',
    fontSize: 12,
  },
});