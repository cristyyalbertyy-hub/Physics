import { useEffect, useRef, useState } from 'react';
import type { GroupId } from '../data/curriculum';
import {
  infographicUrl,
  podcastUrl,
  questionnairePathFor,
  videoUrl,
  type Subchapter,
} from '../data/curriculum';
import { useMediaProgress } from '../hooks/useMediaProgress';
import { bindPlaybackProgress } from '../lib/playbackProgress';
import { assetUrl } from '../utils/assetUrl';
import { MediaBlock } from './MediaBlock';
import { MediaTabs, type MediaTabId } from './MediaTabs';
import { Questionnaire } from './Questionnaire';

type Props = {
  groupId: GroupId;
  sub: Subchapter;
  groupTitle: string;
};

function VideoWithProgress({
  src,
  onMissing,
  onComplete,
}: {
  src: string;
  onMissing: () => void;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindPlaybackProgress(el, onComplete);
  }, [src, onComplete]);

  return (
    <video
      ref={ref}
      className="video"
      controls
      controlsList="nodownload"
      playsInline
      preload="metadata"
      src={src}
      onError={onMissing}
    />
  );
}

function AudioWithProgress({
  src,
  onMissing,
  onComplete,
}: {
  src: string;
  onMissing: () => void;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindPlaybackProgress(el, onComplete);
  }, [src, onComplete]);

  return (
    <audio
      ref={ref}
      className="audio"
      controls
      controlsList="nodownload"
      preload="metadata"
      src={src}
      onError={onMissing}
    >
      Podcast
    </audio>
  );
}

export function SubchapterContent({ groupId, sub, groupTitle }: Props) {
  const [tab, setTab] = useState<MediaTabId>('video');
  const progressItemKey = `${groupId}/${sub.code}`;
  const { trackWatchComplete } = useMediaProgress(progressItemKey);

  useEffect(() => {
    setTab('video');
  }, [groupId, sub.id]);

  const qPath = questionnairePathFor(groupId, sub);
  const audioUrl = assetUrl(podcastUrl(groupId, sub));
  const imageUrl = assetUrl(infographicUrl(groupId, sub));

  const videoPrimary = assetUrl(videoUrl(groupId, sub, 'V'));
  const videoSecondary = assetUrl(videoUrl(groupId, sub, 'Vs'));
  const qKey = assetUrl(qPath);

  const onVideoComplete = () => void trackWatchComplete('V');
  const onPodcastComplete = () => void trackWatchComplete('P');

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
                  <VideoWithProgress src={videoPrimary} onMissing={onMissing} onComplete={onVideoComplete} />
                )}
              </MediaBlock>
              <MediaBlock key={`${groupId}-${sub.id}-vs`} urlKey={videoSecondary} bare>
                {({ onMissing }) => (
                  <VideoWithProgress src={videoSecondary} onMissing={onMissing} onComplete={onVideoComplete} />
                )}
              </MediaBlock>
            </div>
          ) : sub.videoVsOnly ? (
            <MediaBlock key={`${groupId}-${sub.id}-vs`} urlKey={videoSecondary} bare>
              {({ onMissing }) => (
                <VideoWithProgress src={videoSecondary} onMissing={onMissing} onComplete={onVideoComplete} />
              )}
            </MediaBlock>
          ) : (
            <MediaBlock key={`${groupId}-${sub.id}-v`} urlKey={videoPrimary} bare>
              {({ onMissing }) => (
                <VideoWithProgress src={videoPrimary} onMissing={onMissing} onComplete={onVideoComplete} />
              )}
            </MediaBlock>
          )
        ) : null}

        {tab === 'podcast' ? (
          <MediaBlock key={`${groupId}-${sub.id}-podcast`} urlKey={audioUrl} bare>
            {({ onMissing }) => (
              <AudioWithProgress src={audioUrl} onMissing={onMissing} onComplete={onPodcastComplete} />
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
