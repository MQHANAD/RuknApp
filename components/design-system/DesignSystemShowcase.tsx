import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  Container,
  Stack,
  Grid,
  TabBar,
  NavigationBar,
  Modal,
  List,
  ListItem,
  Avatar,
  Chip,
  Loading,
  Skeleton,
  colors,
  typography,
  spacing,
} from './index';

/**
 * Comprehensive Design System Showcase
 *
 * This component demonstrates all the design system components
 * with various states, variants, and configurations.
 */
const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: 'buttons', title: 'Buttons', icon: require('../../assets/icons/home.png') },
    { key: 'inputs', title: 'Inputs', icon: require('../../assets/icons/search.png') },
    { key: 'layout', title: 'Layout', icon: require('../../assets/icons/filters.png') },
    { key: 'navigation', title: 'Navigation', icon: require('../../assets/icons/idea.png') },
    { key: 'data', title: 'Data Display', icon: require('../../assets/icons/user-circle.png') },
  ];

  const renderButtonsSection = () => (
    <Stack spacing="large">
      <Text style={styles.sectionTitle}>Button Variants</Text>
      <Stack spacing="medium">
        <Button variant="primary" onPress={() => setLoading(!loading)}>
          Primary Button
        </Button>
        <Button variant="secondary" onPress={() => setModalVisible(true)}>
          Secondary Button
        </Button>
        <Button variant="ghost" onPress={() => console.log('Ghost pressed')}>
          Ghost Button
        </Button>
      </Stack>

      <Text style={styles.sectionTitle}>Button Sizes</Text>
      <Stack spacing="medium" direction="horizontal">
        <Button size="small" variant="primary">
          Small
        </Button>
        <Button size="medium" variant="primary">
          Medium
        </Button>
        <Button size="large" variant="primary">
          Large
        </Button>
      </Stack>

      <Text style={styles.sectionTitle}>Button States</Text>
      <Stack spacing="medium">
        <Button variant="primary" disabled>
          Disabled Button
        </Button>
        <Button variant="primary" loading={loading}>
          Loading Button
        </Button>
      </Stack>
    </Stack>
  );

  const renderInputsSection = () => (
    <Stack spacing="large">
      <Text style={styles.sectionTitle}>Text Input Variants</Text>
      <Stack spacing="medium">
        <TextInput
          label="Default Input"
          placeholder="Enter text here"
        />
        <TextInput
          label="Input with Helper Text"
          placeholder="Enter email"
          helperText="We'll never share your email"
        />
        <TextInput
          label="Error State"
          placeholder="Enter text"
          error="This field is required"
        />
        <TextInput
          label="Disabled State"
          placeholder="Disabled input"
          disabled
        />
      </Stack>
    </Stack>
  );

  const renderLayoutSection = () => (
    <Stack spacing="large">
      <Text style={styles.sectionTitle}>Container</Text>
      <Container size="narrow" padding="medium" style={styles.demoContainer}>
        <Text>Narrow Container</Text>
      </Container>

      <Text style={styles.sectionTitle}>Stack Layout</Text>
      <Stack spacing="small" style={styles.demoContainer}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Stack>

      <Text style={styles.sectionTitle}>Grid Layout</Text>
      <Grid columns={2} spacing="small" style={styles.demoContainer}>
        <View style={styles.gridItem}><Text>Grid Item 1</Text></View>
        <View style={styles.gridItem}><Text>Grid Item 2</Text></View>
        <View style={styles.gridItem}><Text>Grid Item 3</Text></View>
        <View style={styles.gridItem}><Text>Grid Item 4</Text></View>
      </Grid>
    </Stack>
  );

  const renderNavigationSection = () => (
    <Stack spacing="large">
      <Text style={styles.sectionTitle}>Tab Bar</Text>
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        style={styles.demoContainer}
      />

      <Text style={styles.sectionTitle}>Navigation Bar</Text>
      <NavigationBar
        title="Design System Demo"
        leftAction={{
          key: 'back',
          title: 'Back',
          onPress: () => console.log('Back pressed'),
        }}
        rightActions={[
          {
            key: 'search',
            title: 'Search',
            onPress: () => console.log('Search pressed'),
          },
        ]}
        style={styles.demoContainer}
      />
    </Stack>
  );

  const renderDataDisplaySection = () => (
    <Stack spacing="large">
      <Text style={styles.sectionTitle}>Cards</Text>
      <Stack spacing="medium">
        <Card variant="default">
          <Text>Default Card</Text>
          <Text style={styles.cardSubtitle}>
            This is a default card with shadow and padding
          </Text>
        </Card>
        <Card variant="elevated">
          <Text>Elevated Card</Text>
          <Text style={styles.cardSubtitle}>
            This card has more prominent shadow
          </Text>
        </Card>
        <Card variant="outlined">
          <Text>Outlined Card</Text>
          <Text style={styles.cardSubtitle}>
            This card has a border instead of shadow
          </Text>
        </Card>
      </Stack>

      <Text style={styles.sectionTitle}>List Components</Text>
      <List variant="default">
        <ListItem
          title="List Item 1"
          subtitle="This is a subtitle"
          leftIcon={require('../../assets/icons/home.png')}
          onPress={() => console.log('Item 1 pressed')}
        />
        <ListItem
          title="List Item 2"
          subtitle="Another subtitle"
          onPress={() => console.log('Item 2 pressed')}
        />
        <ListItem
          title="Disabled Item"
          subtitle="This item is disabled"
          disabled
        />
      </List>

      <Text style={styles.sectionTitle}>Avatar & Chips</Text>
      <Stack spacing="medium" direction="horizontal">
        <Avatar name="John Doe" size="medium" />
        <Avatar source={require('../../assets/images/logo.png')} size="medium" />
        <Stack spacing="small">
          <Chip label="Primary" variant="primary" />
          <Chip label="Success" variant="success" />
          <Chip label="Warning" variant="warning" />
          <Chip label="Error" variant="error" />
        </Stack>
      </Stack>

      <Text style={styles.sectionTitle}>Loading States</Text>
      <Stack spacing="medium" direction="horizontal">
        <Loading size="small" />
        <Loading size="medium" />
        <Loading size="large" />
      </Stack>

      <Text style={styles.sectionTitle}>Skeletons</Text>
      <Stack spacing="medium">
        <Skeleton width="100%" height={20} />
        <Skeleton variant="circular" width={60} height={60} />
        <Skeleton variant="rounded" width="100%" height={100} />
      </Stack>
    </Stack>
  );

  const renderCurrentSection = () => {
    switch (activeTab) {
      case 'buttons':
        return renderButtonsSection();
      case 'inputs':
        return renderInputsSection();
      case 'layout':
        return renderLayoutSection();
      case 'navigation':
        return renderNavigationSection();
      case 'data':
        return renderDataDisplaySection();
      default:
        return renderButtonsSection();
    }
  };

  return (
    <Container>
      <Stack spacing="large" style={styles.container}>
        <Text style={styles.title}>Design System Showcase</Text>
        <Text style={styles.subtitle}>
          Comprehensive demonstration of all design system components
        </Text>

        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderCurrentSection()}
        </ScrollView>

        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Design System Modal"
          subtitle="This is a demonstration modal"
        >
          <Stack spacing="medium">
            <Text>This modal demonstrates the design system modal component.</Text>
            <Button
              variant="primary"
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: 'flex-start' }}
            >
              Close Modal
            </Button>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing[6],
  },
  title: {
    ...typography.display.small,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body.large,
    textAlign: 'center',
    color: colors.neutral[600],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.heading.h2,
    marginTop: spacing[4],
    marginBottom: spacing[3],
  },
  scrollView: {
    flex: 1,
  },
  demoContainer: {
    backgroundColor: colors.neutral[50],
    borderRadius: 8,
    padding: spacing[4],
  },
  gridItem: {
    backgroundColor: colors.neutral[200],
    padding: spacing[3],
    borderRadius: 4,
    alignItems: 'center',
  },
  cardSubtitle: {
    ...typography.body.medium,
    color: colors.neutral[600],
    marginTop: spacing[2],
  },
});

export default DesignSystemShowcase;