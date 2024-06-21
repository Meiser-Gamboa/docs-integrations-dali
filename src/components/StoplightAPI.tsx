import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

interface stopLightProps {
    apiDescriptionUrl: string
    basePath?: string
}

const StoplightAPI = ({ apiDescriptionUrl, basePath }: stopLightProps) => {
  return (
    <div>
      <API
        apiDescriptionUrl={apiDescriptionUrl}
        basePath={basePath}
        router="memory"
        layout="sidebar"
      />
    </div>
  );
};

export default StoplightAPI;