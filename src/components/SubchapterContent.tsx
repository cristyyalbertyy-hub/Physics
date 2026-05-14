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
import { Questionnaire } from './Questionnaire';

type Props = {
  groupId: GroupId;
  sub: Subchapter;
};

export function SubchapterContent({ groupId, sub }: Props) {
  const qPath = assetUrl(questionnairePathFor(groupId, sub));
  const audioUrl = assetUrl(podcastUrl(groupId, sub));
  const imageUrl = assetUrl(infographicUrl(groupId, sub));

  const videoPrimary = assetUrl(videoUrl(groupId, sub, 'V'));
  const videoSecondary = assetUrl(videoUrl(groupId, sub, 'Vs'));

  const namingHint =
    sub.groupOnlyAssetNames && groupId === 'F'
      ? 'Fluids media files: F_V.mp4, F_P.m4a, F_I.png, F_Q.csv (and optionally F_Vs.mp4).'
      : `Naming: ${groupId}_${sub.code} with _V, _Vs, _P (.m4a), _I (.png), _Q (.csv).`;

  return (
    <div className="subchapter-content">
      <header className="subchapter-head">
        <p className="eyebrow">{groupId}</p>
        <h2>{sub.title}</h2>
        <p className="muted small">{namingHint}</p>
      </header>

      {sub.dualVideo ? (
        <>
          <MediaBlock
            key={`${groupId}-${sub.id}-v`}
            urlKey={videoPrimary}
            label="Video"
            description="Main clip (_V.mp4)."
          >
            {({ onMissing }) => (
              <video className="video" controls preload="metadata" src={videoPrimary} onError={onMissing} />
            )}
          </MediaBlock>
          <MediaBlock
            key={`${groupId}-${sub.id}-vs`}
            urlKey={videoSecondary}
            label="Video (extended)"
            description="Second clip (_Vs.mp4)."
          >
            {({ onMissing }) => (
              <video className="video" controls preload="metadata" src={videoSecondary} onError={onMissing} />
            )}
          </MediaBlock>
        </>
      ) : sub.videoVsOnly ? (
        <MediaBlock key={`${groupId}-${sub.id}-vs`} urlKey={videoSecondary} label="Video" description="Single clip (_Vs.mp4).">
          {({ onMissing }) => (
            <video className="video" controls preload="metadata" src={videoSecondary} onError={onMissing} />
          )}
        </MediaBlock>
      ) : (
        <MediaBlock key={`${groupId}-${sub.id}-v`} urlKey={videoPrimary} label="Video" description="One MP4 file (_V.mp4).">
          {({ onMissing }) => (
            <video className="video" controls preload="metadata" src={videoPrimary} onError={onMissing} />
          )}
        </MediaBlock>
      )}

      <MediaBlock key={`${groupId}-${sub.id}-podcast`} urlKey={audioUrl} label="Podcast" description="One M4A file per subchapter.">
        {({ onMissing }) => (
          <audio className="audio" controls preload="metadata" src={audioUrl} onError={onMissing}>
            Podcast
          </audio>
        )}
      </MediaBlock>

      <MediaBlock key={`${groupId}-${sub.id}-info`} urlKey={imageUrl} label="Infographic" description="One PNG file per subchapter.">
        {({ onMissing }) => (
          <img
            className="infographic"
            src={imageUrl}
            alt={`Infographic: ${sub.title}`}
            onError={onMissing}
          />
        )}
      </MediaBlock>

      <section className="media-block">
        <header className="media-block-head">
          <h3>Questionnaire</h3>
          <p className="muted small">CSV with a question column and an answer column.</p>
        </header>
        <Questionnaire src={qPath} />
      </section>
    </div>
  );
}
