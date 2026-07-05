import { useEffect, useState } from 'react';
import type { GroupId } from '../data/curriculum';
import {
  infographicUrl,
  podcastUrl,
  questionnairePathFor,
  videoUrl,
  type Subchapter,
} from '../data/curriculum';
import { assetUrl } from '../utils/assetUrl';
import { MediaBlock } from './MediaBlock';
import { MediaTabs, type MediaTabId } from './MediaTabs';
import { Questionnaire } from './Questionnaire';

type Props = {
  groupId: GroupId;
  sub: Subchapter;
  groupTitle: string;
};

export function SubchapterContent({ groupId, sub, groupTitle }: Props) {
  const [tab, setTab] = useState<MediaTabId>('video');

  useEffect(() => {
    setTab('video');
  }, [groupId, sub.id]);

  const qPath = questionnairePathFor(groupId, sub);
  const audioUrl = assetUrl(podcastUrl(groupId, sub));
  const imageUrl = assetUrl(infographicUrl(groupId, sub));

  const videoPrimary = assetUrl(videoUrl(groupId, sub, 'V'));
  const videoSecondary = assetUrl(videoUrl(groupId, sub, 'Vs'));
  const qKey = assetUrl(qPath);

  return (
    <div className="subchapter-content">
      <header className="subchapter-head">
        <p className="eyebrow">{groupTitle}</p>
        <h2>{sub.title}</h2>
      </header>

      <MediaTabs active={tab} onChange={setTab} />

      <div
        className="media-stage"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        onContextMenu={(event) => event.preventDefault()}
      >
        {tab === 'video' ? (
          sub.dualVideo ? (
            <div className="video-stack">
              <MediaBlock key={`${groupId}-${sub.id}-v`} urlKey={videoPrimary} bare>
                {({ onMissing }) => (
                  <video
                    className="video"
                    controls
                    controlsList="nodownload"
                    playsInline
                    preload="metadata"
                    src={videoPrimary}
                    onError={onMissing}
                  />
                )}
              </MediaBlock>
              <MediaBlock key={`${groupId}-${sub.id}-vs`} urlKey={videoSecondary} bare>
                {({ onMissing }) => (
                  <video
                    className="video"
                    controls
                    controlsList="nodownload"
                    playsInline
                    preload="metadata"
                    src={videoSecondary}
                    onError={onMissing}
                  />
                )}
              </MediaBlock>
            </div>
          ) : sub.videoVsOnly ? (
            <MediaBlock key={`${groupId}-${sub.id}-vs`} urlKey={videoSecondary} bare>
              {({ onMissing }) => (
                <video
                  className="video"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  src={videoSecondary}
                  onError={onMissing}
                />
              )}
            </MediaBlock>
          ) : (
            <MediaBlock key={`${groupId}-${sub.id}-v`} urlKey={videoPrimary} bare>
              {({ onMissing }) => (
                <video
                  className="video"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  src={videoPrimary}
                  onError={onMissing}
                />
              )}
            </MediaBlock>
          )
        ) : null}

        {tab === 'podcast' ? (
          <MediaBlock key={`${groupId}-${sub.id}-podcast`} urlKey={audioUrl} bare>
            {({ onMissing }) => (
              <audio
                className="audio"
                controls
                controlsList="nodownload"
                preload="metadata"
                src={audioUrl}
                onError={onMissing}
              >
                Podcast
              </audio>
            )}
          </MediaBlock>
        ) : null}

        {tab === 'infographic' ? (
          <MediaBlock key={`${groupId}-${sub.id}-info`} urlKey={imageUrl} bare>
            {({ onMissing }) => (
              <img
                className="infographic"
                src={imageUrl}
                alt={`Infographic: ${sub.title}`}
                onError={onMissing}
              />
            )}
          </MediaBlock>
        ) : null}

        {tab === 'questions' ? (
          <div key={`${groupId}-${sub.id}-q`} className="media-panel media-panel--questions">
            <Questionnaire paths={[qPath]} urlKey={qKey} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
