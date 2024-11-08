import React, { useState } from 'react';
import {Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Courses: undefined;
  CourseDetails: { course: Course };
  CalculateFees: undefined;
  Contact: undefined;
};

type Course = {
  id: number;
  name: string;
  duration: string;
  fee: number;
};

const Stack = createStackNavigator<RootStackParamList>();

const courses: Course[] = [
  { id: 1, name: 'First Aid', duration: '6 months', fee: 1500 },
  { id: 2, name: 'Sewing', duration: '6 months', fee: 1500 },
  { id: 3, name: 'Landscaping', duration: '6 months', fee: 1500 },
  { id: 4, name: 'Life Skills', duration: '6 months', fee: 1500 },
  { id: 5, name: 'Child Minding', duration: '6 weeks', fee: 750 },
  { id: 6, name: 'Cooking', duration: '6 weeks', fee: 750 },
  { id: 7, name: 'Garden Maintenance', duration: '6 weeks', fee: 750 },
];

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Empowering the Nation</Text>
      <Text style={styles.description}>
        Empowering the Nation offers skills training for domestic workers and gardeners.
        We provide courses to upskill and make our students more marketable when seeking employment.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.buttonText}>View Courses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CalculateFees')}
      >
        <Text style={styles.buttonText}>Calculate Fees</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Contact')}
      >
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

type CoursesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Courses'>;
};

function CoursesScreen({ navigation }: CoursesScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Our Courses</Text>
      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.courseItem}
          onPress={() => navigation.navigate('CourseDetails', { course })}
        >
          <Text style={styles.courseName}>{course.name}</Text>
          <Text>{course.duration}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

type CourseDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'CourseDetails'>;
};

function CourseDetailsScreen({ route }: CourseDetailsScreenProps) {
  const { course } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.description}>Duration: {course.duration}</Text>
      <Text style={styles.description}>Fee: R{course.fee}</Text>
      <Text style={styles.description}>
        Course details and curriculum information would be displayed here.
      </Text>
    </ScrollView>
  );
}

function CalculateFeesScreen() {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [totalFee, setTotalFee] = useState(0);

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses(prevSelected =>
      prevSelected.includes(courseId)
        ? prevSelected.filter(id => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const calculateTotalFee = () => {
    let subtotal = selectedCourses.reduce((total, courseId) => {
      const course = courses.find(c => c.id === courseId);
      return course ? total + course.fee : total;

    }, 0);

    let discount = 0;
    if (selectedCourses.length === 2) discount = 0.05;
    else if (selectedCourses.length === 3) discount = 0.10;
    else if (selectedCourses.length > 3) discount = 0.15;

    const discountedTotal = subtotal * (1 - discount);
    const total = discountedTotal * 1.15; // Adding 15% VAT

    setTotalFee(total);
    Alert.alert('Total Fee', `The total fee including VAT is R${total.toFixed(2)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calculate Fees</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={[
            styles.courseItem,
            selectedCourses.includes(course.id) && styles.selectedCourse
          ]}
          onPress={() => toggleCourseSelection(course.id)}
        >
          <Text style={styles.courseName}>{course.name}</Text>
          <Text>R{course.fee}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={calculateTotalFee}
      >
        <Text style={styles.buttonText}>Calculate Total Fee</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.description}>Phone: 011 123 4567</Text>
      <Text style={styles.description}>Email: info@empoweringthenation.co.za</Text>
      <Text style={styles.description}>Address: 123 Main Road, Johannesburg</Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
        <Stack.Screen name="CalculateFees" component={CalculateFeesScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  courseItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedCourse: {
    backgroundColor: '#e6f3ff',
  },
  courseName: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },});
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  courseItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedCourse: {
    backgroundColor: '#e6f3ff',
    borderColor: '#007AFF',
  },
  courseName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
});
