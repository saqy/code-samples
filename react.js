import React from 'react';
import PropTypes from 'prop-types';
import Notes from 'CoursePlayer/common/Notes';
import Upcoming from 'CoursePlayer/common/Upcoming';
import Outline from 'CoursePlayer/common/Outline';
import Reminders from 'CoursePlayer/common/Reminders';
import Comments from 'CoursePlayer/common/Comments';
import TabSection from 'CoursePlayer/common/TabSection';
import withAppContext from 'CoursePlayer/withAppContext';

class Dashboard extends React.Component {
constructor(props) {
  super(props);
  const isUpcoming = props.appContext.course.isUpcoming();
  this.state = { isUpcoming };
  props.appContext.setNonReactUIForUpcomingState({ isUpcoming });
}

onCountdownEnd = () => {
  const { appContext } = this.props;
  this.setState({ isUpcoming: false });
  appContext.setNonReactUIForUpcomingState({ isUpcoming: false });
};

render() {
  const { appContext } = this.props;
  const { courseData } = appContext.state;
  const { isUpcoming } = this.state;
  const shouldShowReminders = !!courseData.hubspot_form_id;
  return (
    <div className="ygi-course-outline">
      <div className="container">
        <TabSection
          activeSection={appContext.state.activeTabSection}
          onClickTab={appContext.onClickTab}
          sections={[
            {
              name: window.yi.phrases.overview,
              render: (
                { getSectionProps }, // eslint-disable-line react/prop-types
              ) => (
                <div {...getSectionProps()} id="course-description">
                  <article className="container">
                    <div className="row px-3">
                      <div className="col">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: courseData ? courseData.description : '',
                          }}
                        />
                      </div>
                    </div>
                  </article>
                </div>
              ),
            },
            {
              name: window.yi.phrases.notes,
              render: (
                { getSectionProps }, // eslint-disable-line react/prop-types
              ) => (
                <div
                  {...getSectionProps()}
                  id="course-notes"
                  className="ygi-course-outline__panels"
                >
                  <Notes />
                </div>
              ),
            },
            {
              name: window.yi.phrases.comments,
              render: (
                { getSectionProps }, // eslint-disable-line react/prop-types
              ) => (
                <div {...getSectionProps()} id="course-comment-section">

                 <article className="container">
                    <div className="row mb-3 mt-3 px-3">
                      <div id="column-spacing" className="col-md-2" />
                      <div className="col-xs-12 col-md-8">
                        <Comments />
                      </div>
                    </div>
                  </article>
                </div>
              ),
            },
            shouldShowReminders && {
              name: window.yi.phrases.reminders,
              render: (
                { getSectionProps }, // eslint-disable-line react/prop-types
              ) => (
                <div {...getSectionProps()}>
                  <Reminders hubspotFormId={courseData.hubspot_form_id} />
                </div>
              ),
            },
          ].filter(v => v)}
        />
      </div>
    </div>
  );
}
}

const { shape } = PropTypes;

Dashboard.propTypes = {
appContext: shape({}).isRequired,
};

export default withAppContext(Dashboard);