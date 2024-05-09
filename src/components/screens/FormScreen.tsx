import React, {useState, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput, Button, Provider} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

// Custom Hook für Menü-Sichtbarkeit
function useMenuVisibility(initialVisible = false) {
  const [menuVisible, setMenuVisible] = useState<boolean>(initialVisible);
  const toggleMenu = () => setMenuVisible(prev => !prev);
  const closeMenu = () => setMenuVisible(false);
  return [menuVisible, toggleMenu, closeMenu] as const;
}

// Menü-Komponente
function SelectMenu({label, options, selected, onSelect}: any) {
  const [menuVisible, toggleMenu, closeMenu] = useMenuVisibility();
  return (
    <View>
      <Button mode="outlined" onPress={toggleMenu} style={styles.inputStyle}>
        <Text style={styles.buttonText}>{selected || label}</Text>
      </Button>
      {menuVisible && (
        <View style={{backgroundColor: 'white'}}>
          {options.map((option: string) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                onSelect(option);
                closeMenu();
              }}
              accessibilityLabel={`${label}-${option}`}>
              <Text style={{padding: 10, color: 'black'}}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Datums-Komponente
function DateSelector({label, date, onSelect}: any) {
  const [open, setOpen] = useState<boolean>(false);
  const formattedDate = useMemo(() => formatDate(date), [date]);
  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setOpen(true)}
        style={styles.inputStyle}>
        <Text style={styles.buttonText}>{formattedDate || label}</Text>
      </Button>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={(newDate: Date) => {
          onSelect(newDate);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function FormScreen() {
  const [damageNumber, setDamageNumber] = useState<string>('');
  const [selectedDamageType, setSelectedDamageType] =
    useState<string>('Schadenart');
  const [insuranceType, setInsuranceType] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [anrede, setAnrede] = useState<string>('Anrede');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const damageTypes: string[] = ['Unfall', 'Diebstahl', 'Schäden', 'Feuer'];
  const anreden: string[] = ['Herr', 'Frau'];

  async function generatePDF() {
    const htmlContent = `
    <html>
      <head>
        <style>
        body {
          font-family: Arial, sans-serif;
        }
        h2 {
          font-size: 36px; /* Überschrift 2 */
        }
        h3 {
          font-size: 32px; /* Überschrift 3 */
        }
        p {
          margin: 0;
          padding: 4px 0;
          font-size: 30px; /* Absätze */
        }
        </style>
      </head>
      <body marginwidth="50" marginheight="100" topmargin="100" leftmargin="50">
        <h2>Blanko-Auftrag</h2>
        <p><strong>Schadensnummer:</strong> ${damageNumber}</p>
        <p><strong>Schadenart:</strong> ${selectedDamageType}</p>
        <p><strong>Versicherungszweig:</strong> ${insuranceType}</p>
        <p><strong>Datum:</strong> ${formatDate(date)}</p>
        <hr>
        <h3>Kontaktdaten</h3>
        <p>${anrede} ${title} ${firstName} ${lastName}</p>
        <p>${address}</p>
        <p>${zipCode} ${city}</p>
      </body>
    </html>
    `;
    let options = {
      html: htmlContent,
      fileName: 'Blanko_Auftrag',
      directory: 'Documents',
    };
    try {
      let file = await RNHTMLtoPDF.convert(options);
      if (file.filePath) {
        await RNPrint.print({filePath: file.filePath});
      } else {
        console.error('Fehler: Kein Dateipfad vorhanden');
      }
    } catch (error) {
      console.error('Fehler beim Generieren oder Drucken des PDFs:', error);
    }
  }

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Blanko-Auftrag</Text>
          <TouchableOpacity
            onPress={generatePDF}
            style={styles.pdfButton}
            accessibilityLabel="Generate PDF">
            <Icon name="picture-as-pdf" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Schadensnummer */}
        <TextInput
          label="Schadensnummer"
          value={damageNumber}
          onChangeText={(text: string) => setDamageNumber(text)}
          style={styles.inputStyle}
          mode="outlined"
          accessibilityLabel="Damage Number"
        />

        {/* Schadenart */}
        <SelectMenu
          label="Schadenart"
          options={damageTypes}
          selected={selectedDamageType}
          onSelect={(type: string) => setSelectedDamageType(type)}
        />

        {/* Versicherungszweig */}
        <TextInput
          label="Versicherungszweig"
          value={insuranceType}
          onChangeText={(text: string) => setInsuranceType(text)}
          style={styles.inputStyle}
          mode="outlined"
          accessibilityLabel="Insurance Type"
        />

        {/* Datum */}
        <DateSelector label="Datum" date={date} onSelect={setDate} />

        {/* Kontaktdaten */}
        <Text style={styles.subHeader}>Kontaktdaten</Text>

        {/* Anrede */}
        <SelectMenu
          label="Anrede"
          options={anreden}
          selected={anrede}
          onSelect={(selected: string) => setAnrede(selected)}
        />

        {/* Titel */}
        <TextInput
          label="Titel"
          value={title}
          onChangeText={(text: string) => setTitle(text)}
          style={styles.inputStyle}
          mode="outlined"
        />

        {/* Vorname */}
        <TextInput
          label="Vorname"
          value={firstName}
          onChangeText={(text: string) => setFirstName(text)}
          style={styles.inputStyle}
          mode="outlined"
        />

        {/* Nachname */}
        <TextInput
          label="Nachname"
          value={lastName}
          onChangeText={(text: string) => setLastName(text)}
          style={styles.inputStyle}
          mode="outlined"
        />

        {/* Adresse */}
        <TextInput
          label="Straße/Hausnummer"
          value={address}
          onChangeText={(text: string) => setAddress(text)}
          style={styles.inputStyle}
          mode="outlined"
        />

        {/* PLZ */}
        <TextInput
          label="PLZ"
          value={zipCode}
          onChangeText={(text: string) => setZipCode(text)}
          style={styles.inputStyle}
          mode="outlined"
          accessibilityLabel="ZIP Code"
        />

        {/* Ort */}
        <TextInput
          label="Ort"
          value={city}
          onChangeText={(text: string) => setCity(text)}
          style={styles.inputStyle}
          mode="outlined"
          accessibilityLabel="City"
        />
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pdfButton: {
    paddingHorizontal: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  inputStyle: {
    marginBottom: 16,
    borderRadius: 5,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 16,
  },
});
