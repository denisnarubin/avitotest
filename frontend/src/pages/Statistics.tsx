import ModeratorStats from '../components/moderation/ModeratorStats/ModeratorStats';
import PageTransition from '../components/common/PageTransition';

const Statistics = () => {
  return (
    <PageTransition type="fade" duration={0.4}>
      <ModeratorStats />
    </PageTransition>
  );
};

export default Statistics;