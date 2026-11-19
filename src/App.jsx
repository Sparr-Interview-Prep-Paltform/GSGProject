
import React, { useState, useEffect } from 'react';
import AuthPage from './AuthPage';
import { ChartNoAxesColumnIncreasing } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard, FileText, BriefcaseBusiness, History, Settings,Map,
  BookOpen, Plus, ArrowUpRight, ArrowRight, Menu, X, ChevronRight,
  CircleCheck, LockKeyhole, Sparkles, Search, Pencil, Trash2, Building2, XCircle,ArrowLeft
} from 'lucide-react';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/$/, '');

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Resumes', icon: FileText },
  { label: 'Job descriptions', icon: BriefcaseBusiness },
  { label: 'Skill Roadmap', icon: Map },
  { label: 'Interview history', icon: History },
  { label: 'Profile & settings', icon: Settings },
];

const interviews = [
  { date: '20 Oct 2026', role: 'Backend Engineer', company: 'Northstar Labs', attempt: '2', status: 'In progress', score: 'Pending', action: 'Open interview', kind: 'progress' },
  { date: '20 Oct 2026', role: 'Frontend Engineer', company: 'Harbor Studio', attempt: '1', status: 'Created', score: 'Unavailable', action: 'Set up', kind: 'created' },
  { date: '18 Oct 2026', role: 'Backend Engineer', company: 'Northstar Labs', attempt: '1', status: 'Completed', score: '76 / 100', action: 'View report', kind: 'completed' },
];

function App() {
  const [currentUser, setCurrentUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('sparr_user') || 'null'); } catch { return null; } });
  const [active, setActive] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumesError, setResumesError] = useState('');
  const [uploadBusy, setUploadBusy] = useState(false);
   const [resumeDetails, setResumeDetails] = useState(null);
const [resumeDetailsLoading, setResumeDetailsLoading] = useState(false);
const [resumeDetailsError, setResumeDetailsError] = useState('');

const [gapAnalysis, setGapAnalysis] = useState(null);
const [gapAnalysisLoading, setGapAnalysisLoading] = useState(false);
const [gapAnalysisError, setGapAnalysisError] = useState('');

  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [interviewCreating, setInterviewCreating] = useState(false);
const [createdInterview, setCreatedInterview] = useState(null);
const [interviewError, setInterviewError] = useState('');
const [interviewQuestions, setInterviewQuestions] = useState([]);
const [questionsLoading, setQuestionsLoading] = useState(false);
const [questionsError, setQuestionsError] = useState('');

const [roadmap, setRoadmap] = useState(null);
const [roadmapStatus, setRoadmapStatus] = useState(null);
const [roadmapLoading, setRoadmapLoading] = useState(false);
const [roadmapError, setRoadmapError] = useState('');

const [currentQuestion, setCurrentQuestion] = useState(null);
const [currentAnswer, setCurrentAnswer] = useState('');
const [questionLoading, setQuestionLoading] = useState(false);
const [answerSubmitting, setAnswerSubmitting] = useState(false);
const [interviewCompleted, setInterviewCompleted] = useState(false);
const [questionNumber, setQuestionNumber] = useState(1);

  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState('');
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [jobSaveBusy, setJobSaveBusy] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', description: '' });

const [recentInterviews, setRecentInterviews] = useState([]);
const [interviewsLoading, setInterviewsLoading] = useState(true);
const [interviewsError, setInterviewsError] = useState('');

const [latestEstimatedScore, setLatestEstimatedScore] = useState(null);
const [latestPerformanceReport, setLatestPerformanceReport] = useState(null);

const [finalReport, setFinalReport] = useState(null);
const [reportLoading, setReportLoading] = useState(false);
const [reportError, setReportError] = useState('');
const [showReportModal, setShowReportModal] = useState(false);

const [gapAnalysisCreating, setGapAnalysisCreating] = useState(false);

const [interviews, setInterviews] = useState([]);
const [historyLoading, setHistoryLoading] = useState(false);
const [historyError, setHistoryError] = useState('');

const [averageScore, setAverageScore] = useState(null);
const [averageScoreCount, setAverageScoreCount] = useState(0);

const [failedInterviewId, setFailedInterviewId] = useState(null);

const [selectedInterview, setSelectedInterview] = useState(null);
const [interviewDetailReport, setInterviewDetailReport] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);
const [detailsError, setDetailsError] = useState('');

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('sparr_token');
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    return { Accept: 'application/json', Authorization: `Bearer ${token}` };
  };



useEffect(() => {
  if (active !== 'Interview history') return;

  const fetchInterviewHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');

      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to load interview history.'
        );
      }

      setInterviews(result.data ?? []);
    } catch (error) {
      console.error('Interview history error:', error);
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  fetchInterviewHistory();
}, [active]);

const totalSessions = interviews.length;

const completedInterviewss = interviews.filter(
  interview => interview.status === 'completed'
);

const completedCount = completedInterviewss.length;

const fetchFinalReport = async (interviewId) => {
  try {
    // setShowReportModal(true);
    setActive('report');
    setReportLoading(true);
    setReportError('');
    setFinalReport(null);

    const maxAttempts = 20;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await fetch(
        `${API_BASE_URL}/interviews/${interviewId}/report`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      console.log('Final Report Debug:', {
        interviewId,
        attempt,
        status: response.status,
        result,
      });
   

      if (response.status === 202) {
        if (attempt === maxAttempts) {
          throw new Error(
            result.message || 'The report is taking longer than expected.'
          );
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to load final report.'
        );
      }

      const report = result.data ?? result;
      console.log('LATEST PERFORMANCE REPORT:', report);
   console.log('REPORT ANALYSIS:', {
  interviewId,
  overall_score: report.overall_score,
  improvement_areas: report.improvement_areas,
  dimensions: report.dimensions,
});
      setFinalReport(report);
      return;
    }
  } catch (error) {
    console.error('Final report error:', error);
    setReportError(error.message);
  } finally {
    setReportLoading(false);
  }
};

// const fetchInterviewDetails = async (interview) => {
//   try {
//     setSelectedInterview(interview);
//     setActive('interview-details');

//     setDetailsLoading(true);
//     setDetailsError('');
//     setInterviewQuestions([]);
//     setInterviewDetailReport(null);

//     // Get interview questions and answers
//     const questionsResponse = await fetch(
//       `${API_BASE_URL}/interviews/${interview.id}/questions`,
//       {
//         method: 'GET',
//         headers: getAuthHeaders(),
//       }
//     );

//     const questionsResult = await questionsResponse.json();

//     if (!questionsResponse.ok) {
//       throw new Error(
//         questionsResult.message || 'Failed to load interview questions.'
//       );
//     }

//     setInterviewQuestions(questionsResult.data ?? questionsResult);

//     // Get final report
//     const reportResponse = await fetch(
//       `${API_BASE_URL}/interviews/${interview.id}/report`,
//       {
//         method: 'GET',
//         headers: getAuthHeaders(),
//       }
//     );

//     const reportResult = await reportResponse.json();

//     if (reportResponse.ok) {
//       setInterviewDetailReport(reportResult.data ?? reportResult);
//     } else {
//       console.log('Report unavailable:', reportResult.message);
//     }

//   } catch (error) {
//     console.error('Interview details error:', error);
//     setDetailsError(error.message);
//   } finally {
//     setDetailsLoading(false);
//   }
// };

const fetchInterviewDetails = async (interview) => {
  try {
    setSelectedInterview(interview);
    setActive('interview-details');

    setDetailsLoading(true);
    setDetailsError('');
    setInterviewQuestions([]);
    setInterviewDetailReport(null);

    // Fetch questions and answers
    const questionsResponse = await fetch(
      `${API_BASE_URL}/interviews/${interview.id}/questions`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const questionsResult = await questionsResponse.json();

    if (!questionsResponse.ok) {
      throw new Error(
        questionsResult.message || 'Failed to load interview questions.'
      );
    }

    setInterviewQuestions(questionsResult.data ?? []);

    // Fetch final report
    const reportResponse = await fetch(
      `${API_BASE_URL}/interviews/${interview.id}/report`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const reportResult = await reportResponse.json();

    if (reportResponse.ok) {
      setInterviewDetailReport(reportResult.data ?? null);
    }

  } catch (error) {
    console.error('Interview details error:', error);
    setDetailsError(error.message);
  } finally {
    setDetailsLoading(false);
  }
};
  const fetchResumes = async () => {
    setResumesLoading(true);
    setResumesError('');
    try {
      const response = await fetch(`${API_BASE_URL}/resumes?page=1`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Failed to load resumes (${response.status}).`);
      }
      const records = Array.isArray(data.data) ? data.data : [];
      setResumes(records);
      setSelectedResume(current =>
        records.some(resume => resume.id === current) ? current : (records.find(resume => resume.parsing_status === 'completed')?.id ?? null)
      );
    } catch (err) {
      setResumesError(err instanceof TypeError
        ? `Could not connect to the backend at ${API_BASE_URL}.`
        : (err.message || 'Could not load resumes.'));
    } finally {
      setResumesLoading(false);
    }
  };

  useEffect(() => {
  const fetchRecentInterviews = async () => {
    try {
      setInterviewsLoading(true);
      setInterviewsError('');

      const response = await fetch(
        `${API_BASE_URL}/interviews`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to load interviews.'
        );
      }

      setRecentInterviews(
        Array.isArray(result.data) ? result.data : []
      );

    } catch (error) {
      console.error('Fetch interviews error:', error);
      setInterviewsError(error.message);
    } finally {
      setInterviewsLoading(false);
    }
  };


if (currentUser && active === 'Dashboard') {
  fetchRecentInterviews();
}
}, [currentUser, active]);


useEffect(() => {
  const fetchLatestEstimatedScore = async () => {
    const completedInterviews = recentInterviews.filter(
      interview => interview.status?.toLowerCase() === 'completed'
    );

    setLatestEstimatedScore(null);
    setLatestPerformanceReport(null);

    for (const interview of completedInterviews) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/interviews/${interview.id}/report`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json().catch(() => ({}));

        console.log(`REPORT FOR INTERVIEW #${interview.id}:`, {
          status: response.status,
          result,
        });

        if (!response.ok) {
          continue;
        }

        const report = result.data ?? result;
        const score = Number(report.overall_score);

        if (!Number.isFinite(score)) {
          continue;
        }

        setLatestPerformanceReport(report);
        setLatestEstimatedScore(score);

        return;
      } catch (error) {
        console.error(
          `Report error for interview #${interview.id}:`,
          error
        );
      }
    }
  };

  if (recentInterviews.length > 0) {
    fetchLatestEstimatedScore();
  } else {
    setLatestEstimatedScore(null);
    setLatestPerformanceReport(null);
  }
}, [recentInterviews]);




useEffect(() => {
  const fetchAverageScore = async () => {
    const completed = interviews.filter(
      interview => interview.status === 'completed'
    );

    if (completed.length === 0) {
      setAverageScore(null);
      setAverageScoreCount(0);
      return;
    }

    try {
      const reports = await Promise.all(
        completed.map(async interview => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/interviews/${interview.id}/report`,
              {
                method: 'GET',
                headers: getAuthHeaders(),
              }
            );

            const result = await response.json();

            if (!response.ok) return null;

            const report = result.data ?? result;
            const score = Number(report.overall_score);

            return Number.isFinite(score) ? score : null;
          } catch (error) {
            console.error(
              `Failed to fetch report for interview ${interview.id}:`,
              error
            );
            return null;
          }
        })
      );

      const validScores = reports.filter(score => score !== null);

      setAverageScoreCount(validScores.length);

      if (validScores.length === 0) {
        setAverageScore(null);
        return;
      }

      const average =
        validScores.reduce((sum, score) => sum + score, 0) /
        validScores.length;

      setAverageScore(average);

    } catch (error) {
      console.error('Average score error:', error);
      setAverageScore(null);
      setAverageScoreCount(0);
    }
  };

  if (interviews.length === 0) {
    setAverageScore(null);
    setAverageScoreCount(0);
    return;
  }

  fetchAverageScore();
}, [interviews]);

useEffect(() => {
  if (!createdInterview?.id) return;

  let cancelled = false;
  let timer;


const fetchInterviewQuestions = async () => {
  try {
    setQuestionsLoading(true);
    setQuestionsError('');

    const response = await fetch(
      `${API_BASE_URL}/interviews/${createdInterview.id}/questions`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (cancelled) return;

    // Interview is still being prepared
    if (
      response.status === 202 ||
      result.interview_status === 'preparing'
    ) {
      setCreatedInterview(current => ({
        ...current,
        status: 'preparing',
      }));

      timer = window.setTimeout(fetchInterviewQuestions, 2000);
      return;
    }

    // Interview question generation failed
    if (result.interview_status === 'failed') {
      setCreatedInterview(current => ({
        ...current,
        status: 'failed',
      }));

      setFailedInterviewId(createdInterview.id);

      throw new Error(
        result.message || 'Interview question generation failed.'
      );
    }

    // Handle other HTTP errors
    if (!response.ok) {
      throw new Error(
        result.message ||
        `Could not load questions (${response.status}).`
      );
    }

    // Questions are ready
    if (
      result.interview_status === 'ready' ||
      result.interview_status === 'in_progress'
    ) {
      const questions = Array.isArray(result.data)
        ? result.data
        : [];

      setInterviewQuestions(questions);

      setCreatedInterview(current => ({
        ...current,
        status: result.interview_status,
      }));

      setQuestionsLoading(false);

      if (questions.length > 0) {
        await fetchNextQuestion(createdInterview.id);
      }

      return;
    }

    throw new Error('Unexpected interview status.');

  } catch (err) {
    if (cancelled) return;

    setQuestionsError(
      err.message || 'Could not load interview questions.'
    );

    setQuestionsLoading(false);
  }
};

  fetchInterviewQuestions();

  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
// }, [createdInterview?.id]);
}, [createdInterview?.id, createdInterview?.status]);

  const fetchResumeDetails = async (resumeId) => {
  if (!resumeId) return;

  setResumeDetailsLoading(true);
  setResumeDetailsError('');
  setResumeDetails(null);


  try {
    const response = await fetch(
      `${API_BASE_URL}/resumes/${resumeId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Failed to load resume details (${response.status}).`
      );
    }

    setResumeDetails(data.data ?? data);
  } catch (err) {
    setResumeDetailsError(
      err instanceof TypeError
        ? `Could not connect to the backend at ${API_BASE_URL}.`
        : err.message || 'Could not load resume details.'
    );
  } finally {
    setResumeDetailsLoading(false);
  }
};

const fetchGapAnalysis = async (jobId, resumeId) => {
  if (!jobId || !resumeId) {
    setGapAnalysisError('Please select a job description and a resume.');
    return;
  }

  setGapAnalysisLoading(true);
  setGapAnalysisError('');

  try {
setRoadmap(null);
setRoadmapStatus(null);
setRoadmapError('');
    const response = await fetch(
      `${API_BASE_URL}/job-descriptions/${jobId}/gap-analysis/${resumeId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Failed to load skill gap analysis (${response.status}).`
      );
    }

    setGapAnalysis(data.data?.analysis || null);

    setRoadmap(data.data?.roadmap || []);
setRoadmapStatus(data.data?.roadmap_status || null);
  } catch (err) {
    setGapAnalysisError(
      err instanceof TypeError
        ? `Could not connect to the backend at ${API_BASE_URL}.`
        : err.message || 'Could not load skill gap analysis.'
    );
  } finally {
    setGapAnalysisLoading(false);
  }
};

const fetchRoadmapStatus = async (jobId, resumeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/job-descriptions/${jobId}/gap-analysis/${resumeId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Failed to load roadmap (${response.status}).`
      );
    }

    setRoadmap(data.data?.roadmap || []);
    setRoadmapStatus(data.data?.roadmap_status || null);

    if (data.data?.roadmap_status === 'failed') {
      setRoadmapError('Failed to generate the learning roadmap.');
    } else {
      setRoadmapError('');
    }
  } catch (err) {
    setRoadmapError(err.message || 'Failed to check roadmap status.');
  }
};

useEffect(() => {
  if (!selectedJobId || !selectedResume) return;

  if (
    roadmapStatus !== 'pending' &&
    roadmapStatus !== 'processing'
  ) {
    return;
  }

  const timer = setTimeout(() => {
    fetchRoadmapStatus(selectedJobId, selectedResume);
  }, 2000);

  return () => clearTimeout(timer);
}, [roadmapStatus, selectedJobId, selectedResume]);

useEffect(() => {
  if (active !== 'New interview') return;
  if (!selectedResume || !selectedJobId) return;

  const resume = resumes.find(
    item => item.id === selectedResume
  );

  const job = jobDescriptions.find(
    item => item.id === selectedJobId
  );

  if (!resume || !job) return;

  if (
    resume.parsing_status !== 'completed' ||
    job.parsing_status !== 'completed'
  ) {
    setGapAnalysis(null);
    setGapAnalysisError('Your resume or job description is still being processed.');
    return;
  }

  fetchGapAnalysis(selectedJobId, selectedResume);

}, [active, selectedResume, selectedJobId, resumes, jobDescriptions]);


useEffect(() => {
  if (active !== 'Skill Roadmap') return;
  if (!selectedResume || !selectedJobId) return;

  fetchGapAnalysis(selectedJobId, selectedResume);
}, [active, selectedResume, selectedJobId]);


  useEffect(() => {
    if (currentUser) fetchResumes();
  }, [currentUser]);

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf|txt)$/i.test(file.name)) {
      announce('Unsupported file type. Please choose a PDF or TXT file.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      announce('This file exceeds the 5 MB limit. Choose a smaller file.');
      event.target.value = '';
      return;
    }

    setUploadBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(' ')
          : '';
        throw new Error(validationErrors || data.message || `Upload failed (${response.status}).`);
      }

      const uploadedResume = data.data;
      if (uploadedResume?.id) setSelectedResume(uploadedResume.id);
      announce(data.message || 'Resume uploaded successfully.');
      await fetchResumes();
      if (uploadedResume?.id) setSelectedResume(uploadedResume.id);
    } catch (err) {
      announce(err instanceof TypeError
        ? `Could not connect to the backend at ${API_BASE_URL}.`
        : (err.message || 'Resume upload failed.'));
    } finally {
      setUploadBusy(false);
      event.target.value = '';
    }
  };

  const formatResumeDate = (date) => {
    if (!date) return 'Date unavailable';
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
  };

  const resumeStatusLabel = (status) => ({
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  }[status] || 'Unknown');

 

  const fetchJobDescriptions = async () => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/job-descriptions?page=1&per_page=15`, {
        method: 'GET', headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Failed to load job descriptions (${response.status}).`);
      const records = Array.isArray(data.data) ? data.data : [];
            console.log('Fetched jobs:', records);

      setJobDescriptions(records);
      setSelectedJobId(current => records.some(job => job.id === current) ? current : (records.find(job => job.parsing_status === 'completed')?.id ?? null));
    } catch (err) {
      setJobsError(err instanceof TypeError ? `Could not connect to the backend at ${API_BASE_URL}.` : (err.message || 'Could not load job descriptions.'));
    } finally { setJobsLoading(false); }
  };



const fetchNextQuestion = async (interviewId) => {
  setQuestionLoading(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/interviews/${interviewId}/questions/next`,
      {
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch next question');
    }

    if (result.data === null) {
      if (
        result.interview_status === 'completed' ||
        result.status === 'completed'
      ) {
        setCurrentQuestion(null);
        setInterviewCompleted(true);
      } else {
        setInterviewCompleted(false);
        setCurrentQuestion(null);
        announce('The next question is not available yet. Please try again.');
      }

      return;
    }

    setInterviewCompleted(false);
    setCurrentQuestion(result.data);
    setCurrentAnswer('');

  } catch (error) {
    console.error(error);
    announce(error.message);
  } finally {
    setQuestionLoading(false);
  }
};

const handleSubmitAnswer = async () => {
  if (!currentAnswer.trim() || !currentQuestion || !createdInterview) {
    return;
  }

  setAnswerSubmitting(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/interviews/${createdInterview.id}/questions/${currentQuestion.id}/answer`,
      {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: currentAnswer.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit answer');
    }

    setQuestionNumber((previous) => previous + 1);

    await fetchNextQuestion(createdInterview.id);

  } catch (error) {
    console.error(error);
    announce(error.message);
  } finally {
    setAnswerSubmitting(false);
  }
};
  const fetchJobDetails = async (jobId, quiet = false) => {
    if (!jobId) return;
    if (!quiet) setJobDetailsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job-descriptions/${jobId}`, {
        method: 'GET', headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Failed to load job details (${response.status}).`);
      setSelectedJobDetails(data.data || null);
    } catch (err) {
      if (!quiet) announce(err instanceof TypeError ? `Could not connect to the backend at ${API_BASE_URL}.` : (err.message || 'Could not load job details.'));
    } finally { if (!quiet) setJobDetailsLoading(false); }
  };
 
  useEffect(() => {
  if (currentUser && (active === 'Job descriptions' || active === 'Dashboard')) {
    fetchJobDescriptions();
  }
}, [currentUser, active]);

  useEffect(() => {
    if (!selectedJobId || active !== 'Job descriptions') { setSelectedJobDetails(null); return; }
    fetchJobDetails(selectedJobId);
  }, [selectedJobId, active]);

  useEffect(() => {
    const status = selectedJobDetails?.parsing_status;
    if (!selectedJobId || active !== 'Job descriptions' || !['pending', 'processing'].includes(status)) return;
    const timer = window.setInterval(() => fetchJobDetails(selectedJobId, true), 4000);
    return () => window.clearInterval(timer);
  }, [selectedJobId, selectedJobDetails?.parsing_status, active]);

  const resetJobForm = () => {
    setJobForm({ title: '', company: '', description: '' });
    setJobFormOpen(false);
  };

  const saveJob = async (event) => {
    event.preventDefault();
    const title = jobForm.title.trim();
    const company_name = jobForm.company.trim();
    const description = jobForm.description.trim();
    if (!title || !company_name || !description) {
      announce('Please fill in the job title, company name, and description.');
      return;
    }
    setJobSaveBusy(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job-descriptions`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company_name, description }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const validationErrors = data.errors ? Object.values(data.errors).flat().join(' ') : '';
        throw new Error(validationErrors || data.message || `Could not save job description (${response.status}).`);
      }
      const created = data.data;
      announce(data.message || 'Job description saved successfully.');
      resetJobForm();
      await fetchJobDescriptions();
      if (created?.id) setSelectedJobId(created.id);
    } catch (err) {
      announce(err instanceof TypeError ? `Could not connect to the backend at ${API_BASE_URL}.` : (err.message || 'Could not save job description.'));
    } finally { setJobSaveBusy(false); }
  };


const handleStartInterview = async () => {
  if (!selectedResume || !selectedJobId) {
    announce('Please select a resume and a job description.');
    return;
  }

  if (!gapAnalysis) {
    announce('Please analyze the skill gap before starting.');
    return;
  }

  setInterviewCreating(true);
  setInterviewError('');
  setQuestionsError('');
  setFailedInterviewId(null);

  try {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_id: selectedResume,
        job_description_id: selectedJobId,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Could not create interview (${response.status}).`
      );
    }

    const interview = data.data;

    setCreatedInterview(interview);
    setInterviewQuestions([]);
    setQuestionNumber(1);
    setInterviewCompleted(false);
    setCurrentQuestion(null);
    setCurrentAnswer('');

    // Keep the interview ID in case question generation fails.
    setFailedInterviewId(interview.status === 'failed' ? interview.id : null);

    announce('Interview created successfully!');
  } catch (err) {
    const message = err instanceof TypeError
      ? `Could not connect to the backend at ${API_BASE_URL}.`
      : err.message || 'Could not create interview.';

    setInterviewError(message);
  } finally {
    setInterviewCreating(false);
  }
};


const handleRetryInterview = async () => {
  if (!failedInterviewId) {
    setInterviewError('Interview ID is missing. Please try again later.');
    return;
  }

  setInterviewCreating(true);
  setInterviewError('');
  setQuestionsError('');

  try {
    const response = await fetch(
      `${API_BASE_URL}/interviews/${failedInterviewId}/retry`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `Retry failed (${response.status}).`
      );
    }

   setCreatedInterview(prev => ({
  ...prev,
  status: 'preparing',
}));

setFailedInterviewId(null);
setQuestionsLoading(true);
setQuestionsError('');

setInterviewQuestions([]);
setCurrentQuestion(null);
setCurrentAnswer('');

announce('Question generation has been restarted!');
  } catch (err) {
    setInterviewError(
      err instanceof TypeError
        ? `Could not connect to the backend at ${API_BASE_URL}.`
        : err.message || 'Could not retry question generation.'
    );
  } finally {
    setInterviewCreating(false);
  }
};


const handleAnalyzeSkills = async () => {
  if (!selectedResume || !selectedJobId) {
    announce('Please select a resume and a job description.');
    return;
  }

  setGapAnalysisCreating(true);
  setGapAnalysisError('');
  setGapAnalysis(null);

  try {
    const response = await fetch(
      `${API_BASE_URL}/job-descriptions/${selectedJobId}/gap-analysis/${selectedResume}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `Skill analysis failed (${response.status}).`
      );
    }

    const analysis = result.data?.analysis;

    if (!analysis) {
      throw new Error('The analysis response is missing skill data.');
    }

    setGapAnalysis(analysis);
    announce('Skill gap analysis completed successfully!');

  } catch (error) {
    console.error('Skill gap analysis error:', error);
    setGapAnalysisError(error.message || 'Could not analyze skills.');
  } finally {
    setGapAnalysisCreating(false);
  }
};



const handleStartAnotherInterview = () => {
  setCreatedInterview(null);
  setInterviewQuestions([]);
  setCurrentQuestion(null);
  setCurrentAnswer('');
  setInterviewCompleted(false);
  setQuestionNumber(1);
  setQuestionsError('');
  setQuestionsLoading(false);
  setQuestionLoading(false);
  setGapAnalysis(null);
  setGapAnalysisError('');

  setActive('New interview');
};
  const announce = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
    setMenuOpen(false);
  };


if (!currentUser) {
  return (
    <>
      <Toaster position="top-right" />
      <AuthPage
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setActive('Dashboard');
        }}
      />
    </>
  );
}

  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();

const completedInterviews = recentInterviews.filter(
  interview => interview.status?.toLowerCase() === 'completed'
);

const completedInterviewsCount = recentInterviews.filter(
  (interview) => interview.status?.toLowerCase() === 'completed'
).length;
  const hasResume = resumes.length > 0;
const hasJobDescription = jobDescriptions.length > 0;



const resumeCompleted = resumes.some(
  resume => resume.parsing_status === 'completed'
);

const jobCompleted = jobDescriptions.some(
  job => job.parsing_status === 'completed'
);

let currentFocus = {
  title: 'Resume upload',
  description: 'Upload your resume to get started',
};

if (resumes.length === 0) {
  currentFocus = {
    title: 'Resume upload',
    description: 'Upload your resume to get started',
  };
} else if (jobDescriptions.length === 0) {
  currentFocus = {
    title: 'Target job',
    description: 'Add a job description for your desired role',
  };
} else if (!resumeCompleted || !jobCompleted) {
  currentFocus = {
    title: 'Document processing',
    description: 'Your resume and job description are being processed',
  };
} else if (completedInterviewsCount === 0) {
  currentFocus = {
    title: 'Interview practice',
    description: 'Start practicing with personalized interview questions',
  };
} else {
  currentFocus = {
    title: 'Performance improvement',
    description: 'Review your interview results and improve your weak areas',
  };
}

const hasPendingAnalysis = [...resumes, ...jobDescriptions].some(
  item => ['pending', 'processing'].includes(item.parsing_status)
);

let nextStepTitle = 'Upload your resume';
let nextStepDescription = 'Start by adding your resume to your workspace.';
let nextStepButton = 'Upload resume';
let nextStepAction = 'Resumes';

if (hasResume && !hasJobDescription) {
  nextStepTitle = 'Add a job description';
  nextStepDescription = 'Choose a target role to continue your preparation.';
  nextStepButton = 'Add job description';
  nextStepAction = 'Job descriptions';
} else if (hasResume && hasJobDescription && hasPendingAnalysis) {
  nextStepTitle = 'Your skills are being analyzed';
  nextStepDescription = 'Your resume and job description are being processed.';
  nextStepButton = 'View progress';
  nextStepAction = 'Job descriptions';
} else if (hasResume && hasJobDescription && resumeCompleted && jobCompleted) {
  nextStepTitle = 'Your documents are ready';
  nextStepDescription = 'Your resume and job description have been analyzed.';
  nextStepButton = 'View job description';
  nextStepAction = 'Job descriptions';
}
  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <header className="topbar">
        <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <button className="brand" onClick={() => setActive('Dashboard')} aria-label="Sparr home">
          <span className="brand-name">sparr<span className="brand-dot">.</span></span>
          <span className="brand-subtitle">TECHNICAL INTERVIEW PRACTICE</span>
        </button>
        <div className="topbar-right">
          <span className="privacy-label"><LockKeyhole size={14} /> Private workspace</span>
          <span className="top-divider">/</span>
          <button className="profile-chip" onClick={() => setActive('Profile & settings')}>
            <span className="avatar">{initials}</span><span>{displayName}</span><ChevronRight size={15} />
          </button>
          <button className="logout-button" onClick={() => { sessionStorage.removeItem('sparr_token'); sessionStorage.removeItem('sparr_user'); setCurrentUser(null); setActive('Dashboard'); }} title="Sign out">Sign out</button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
          <div className="nav-label">WORKSPACE</div>
          <nav>
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} className={`nav-item ${active === label ? 'active' : ''}`}
                onClick={() => { setActive(label); setMenuOpen(false); }}>
                <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                {active === label && <span className="active-indicator" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-note">
            <div className="privacy-icon"><LockKeyhole size={16} /></div>
            <p>Your documents, interviews and reports are private to your account.</p>
          </div>
          <button className="guide-link" onClick={() => announce('Preparation guide will be added in a future step.')}>
            <BookOpen size={16} /> Preparation guide <ArrowUpRight size={14} />
          </button>
          <div className="sidebar-bottom"><Sparkles size={16} /><span>Practice with purpose.</span></div>
        </aside>

        <main className="main-content">
        {/* <button onClick={() => fetchFinalReport(50)}>
                   test
          </button> */}
          {active === 'Dashboard' ? <>
          <div className="page-heading">
            <div>
        
              <div className="eyebrow">YOUR PRIVATE WORKSPACE <span className="eyebrow-line" /></div>
              <h1>Welcome back, <span>{displayName.split(/\s+/)[0]}</span></h1>
              <p className="subtitle">  Build confidence for your next technical interview.</p>
            </div>
            <button className="primary-button" onClick={() => setActive('New interview')}>
              <Plus size={18} /> New interview
            </button>
          </div>

          
          <div className="overview-row">
  <span>Your preparation overview</span>
  <span className="date-label">
    {new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}
  </span>
</div>

       
          <section className="next-step card">
  <div className="next-step-top">
    <div>
      <div className="section-kicker">
        <span className="live-dot" /> YOUR NEXT STEP
      </div>
      <h2>{nextStepTitle}</h2>
      <p className="muted">{nextStepDescription}</p>
    </div>

    <span className="status-pill in-progress">
      {hasResume && hasJobDescription ? 'In progress' : 'Not started'}
    </span>
  </div>

  <div className="next-step-bottom">
    <div className="saved-info">
      <CircleCheck size={16} />
      {resumes.length} resume(s)
      <span>·</span>
      {jobDescriptions.length} job description(s)
    </div>

    <button
      className="dark-button"
      onClick={() => setActive(nextStepAction)}
    >
      {nextStepButton} <ArrowRight size={16} />
    </button>
  </div>
</section>

         
          <section className="journey-grid" aria-label="Preparation steps">
  {[
    {
      number: '01',
      title: 'Resume',
      description: resumes.length
        ? (resumes[0].title || resumes[0].file_name || 'Resume uploaded')
        : 'No resume uploaded yet',
      state: resumes.length
        ? resumes[0].parsing_status === 'completed'
          ? 'Ready'
          : resumes[0].parsing_status === 'failed'
            ? 'Needs attention'
            : 'Processing'
        : 'Not started',
    },
    {
      number: '02',
      title: 'Target job',
      description: jobDescriptions.length
        ? `${jobDescriptions[0].title || 'Job description'}${jobDescriptions[0].company_name ? ` · ${jobDescriptions[0].company_name}` : ''}`
        : 'No job description added yet',
      state: jobDescriptions.length
        ? jobDescriptions[0].parsing_status === 'completed'
          ? 'Ready'
          : jobDescriptions[0].parsing_status === 'failed'
            ? 'Needs attention'
            : 'Processing'
        : 'Not started',
    },
    {
      number: '03',
      title: 'Skill gaps',
      description: 'Based on your resume and target job',
      state:
        resumes.some(r => r.parsing_status === 'completed') &&
        jobDescriptions.some(j => j.parsing_status === 'completed')
          ? 'Ready'
          : 'Waiting',
    },
    {
      number: '04',
      title: 'Interview',
      description: 'Your interview preparation starts here',
      state: 'Not started',
    },
  ].map((item) => (
    <div className="journey-card" key={item.number}>
      <div className="journey-top">
        <span className="journey-number">{item.number}</span>
        {item.state === 'Ready' && (
          <CircleCheck size={16} className="check-icon" />
        )}
      </div>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <span className={`journey-state ${item.state === 'Ready' ? 'current' : ''}`}>
        {item.state}
      </span>
    </div>
  ))}
</section>

       
          <section className="stats-grid">
  
  <div className="stat-card card">
  <div className="stat-top">
    <span>Completed interviews</span>

    <span className="stat-icon">
      <History size={17} />
    </span>
  </div>

  <div className="stat-value" style={{fontSize:'24px'}}>
    {completedInterviewsCount}
    <span className="stat-small"> sessions</span>
  </div>

  <p className="stat-foot">
    {completedInterviewsCount === 0
      ? 'No completed interviews yet'
      : `${completedInterviewsCount} completed interview sessions`}
  </p>
</div>

  <div className="stat-card card">
    <div className="stat-top">
      <span>Latest estimated score</span>
      <span className="stat-icon"><Sparkles size={17} /></span>
    </div>
   
    <div className="stat-value" style={{fontSize:'24px'}}>
  {latestEstimatedScore !== null
    ? latestEstimatedScore
    : '—'}
  <span className="stat-denom">/100</span>
</div>

<p className="stat-foot">
  {latestEstimatedScore !== null
    ? 'Latest interview report score'
    : 'No interview reports available yet'}
</p>
  </div>

 
  <div className="stat-card focus-card card">
  <div className="stat-top">
    <span>Current focus</span>

    <span className="stat-icon focus-icon">
      <ArrowUpRight size={17} />
    </span>
  </div>

  <div>
    {currentFocus.title}
  </div>

  <p className="stat-foot">
    {currentFocus.description}
  </p>
</div>
</section>


                  
          <section className="insights-grid">

  <div className="card performance-card">
  <div className="card-heading">
    <div>
      <div className="section-kicker">PERFORMANCE</div>
      <h2>Latest completed performance</h2>
    </div>

    <span className="soft-tag">
      {latestPerformanceReport ? 'Report available' : 'No reports yet'}
    </span>
  </div>

  {latestPerformanceReport ? (
    <>
      <div className="performance-overview">
        <div className="performance-score">
          <span className="muted">Overall score</span>

          <div className="stat-value">
            {latestPerformanceReport.overall_score}
            <span className="stat-denom">/100</span>
          </div>
        </div>

        <div className="performance-summary">
          <h3>Performance summary</h3>
          <p className="muted">
            {latestPerformanceReport.summary || 'No summary available.'}
          </p>
        </div>
      </div>

      <div className="performance-dimensions">
        <h3>Performance breakdown</h3>

        {latestPerformanceReport.dimensions?.map((item) => (
          <div className="dimension-item" key={item.dimension}>
            <div className="dimension-header">
              <strong>
                {item.dimension.replaceAll('_', ' ')}
              </strong>

              <span>{item.score}/5</span>
            </div>

            <div className="dimension-progress">
              <div
                className="dimension-progress-fill"
                style={{ width: `${item.score}%` }}
              />
            </div>

            <p className="muted">{item.evidence}</p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="empty-performance">
      <div className="empty-chart-icon">
        <ChartNoAxesColumnIncreasing size={28} />
      </div>

      <h3>No completed interviews yet</h3>

      <p className="muted">
        Your performance breakdown will appear here after you complete
        your first interview.
      </p>
    </div>
  )}

  <div className="chart-footer">
    <span className="muted">
      Your interview scores will be tracked here.
    </span>
  </div>
</div>

 
  
<div className="card coaching-card">
  <div className="coaching-header">
    <div className="coaching-icon">
      <Sparkles size={18} />
    </div>

    <div>
      <div className="section-kicker">PERSONALIZED INSIGHT</div>
      <h2>Your personal feedback</h2>
    </div>
  </div>

  <p className="muted coaching-description">
    Personalized recommendations based on your interview performance.
  </p>

  {latestPerformanceReport ? (
    <div className="personalized-insight">

      <div className="insight-summary">
        <div className="insight-section-title">
          <Sparkles size={17} />
          <h3>Interview feedback</h3>
        </div>

        <p>{latestPerformanceReport.summary}</p>
      </div>

      <div className="insight-improvements">
        <div className="insight-section-title">
          <h3>Areas to improve</h3>
          <span className="soft-tag">
            {latestPerformanceReport.improvement_areas?.length ||
              latestPerformanceReport.dimensions?.filter(
                item => item.score < 70
              ).length || 0} areas
          </span>
        </div>

        <div className="improvement-list">
          {latestPerformanceReport.improvement_areas?.length > 0 ? (
            latestPerformanceReport.improvement_areas.map((area, index) => (
              <div className="improvement-item" key={index}>
                <div className="improvement-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p>
                  {typeof area === 'string'
                    ? area
                    : area.description || area.name || JSON.stringify(area)}
                </p>
              </div>
            ))
          ) : (
            latestPerformanceReport.dimensions
              ?.filter(item => item.score < 70)
              .map((item, index) => (
                <div className="improvement-item" key={item.dimension}>
                  <div className="improvement-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="improvement-content">
                    <h4>
                      {item.dimension.replaceAll('_', ' ')}
                    </h4>
                    <p>{item.evidence}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="empty-insight">
      <Sparkles size={22} />
      <h3>Insights are coming soon</h3>
      <p className="muted">
        Complete an interview to receive feedback on your strengths
        and areas for improvement.
      </p>
    </div>
  )}

  <button
    className="outline-button"
    onClick={() => setActive('New interview')}
  >
    Start an interview <ArrowRight size={15} />
  </button>
</div>

</section>

         

<section className="card interviews-card">
  <div className="table-heading">
    <div>
      <div className="section-kicker">YOUR PRACTICE</div>
      <h2>Recent interviews</h2>
    </div>

    <button
      className="text-button"
      onClick={() => setActive('Interview history')}
    >
      View all history <ArrowRight size={15} />
    </button>
  </div>

  {interviewsLoading ? (
    <div className="empty-interviews">
      <p>Loading interviews...</p>
    </div>
  ) : interviewsError ? (
    <div className="empty-interviews">
      <p>{interviewsError}</p>
    </div>
  ) : recentInterviews.length === 0 ? (
    // Empty State
    <div className="empty-interviews">
      <div className="empty-interviews-icon">
        <History size={26} />
      </div>

      <h3>No interviews yet</h3>

      <p>
        Your interview sessions will appear here once you start practicing.
      </p>

      <button
        className="dark-button"
        onClick={() => setActive('New interview')}
      >
        Start your first interview <ArrowRight size={16} />
      </button>
    </div>
  ) : (
    // Interviews List
    <>
      <div className="recent-interviews-list">
        {recentInterviews.slice(0, 5).map((interview) => (
          <div
            className="recent-interview-item"
            key={interview.id}
              onClick={() => fetchInterviewDetails(interview)}
  style={{ cursor: 'pointer' }}
          >
            <div className="recent-interview-info">
              <h3>Interview #{interview.id}</h3>

              <p>
                {interview.started_at
                  ? new Date(interview.started_at).toLocaleDateString()
                  : 'Date unavailable'}
              </p>
            </div>

            <div className="recent-interview-details">
              <span
                className={`status ${interview.status}`}
              >
                {interview.status.replaceAll('_', ' ')}
              </span>

              <p>
                {interview.total_questions ?? 0} questions
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-footer">
        <span>
          Showing <strong>{Math.min(recentInterviews.length, 5)}</strong> interviews
        </span>

        <button onClick={() => setActive('Interview history')}>
          See all interviews <ChevronRight size={15} />
        </button>
      </div>
    </>
  )}
</section>


          <footer className="page-footer">
            <LockKeyhole size={14} />
            <span>Your preparation data is private and visible only to you.</span>
            <span className="footer-divider">·</span>
            <span>Practice, learn, improve.</span>
          </footer>
       
</>
 : active === 'report' ? (
  <section className="inner-page report-page">

    <div className="page-heading">
      <div>
        <div className="eyebrow">
          INTERVIEW PERFORMANCE
          <span className="eyebrow-line" />
        </div>

        <h1>Your Final Report</h1>

        <p className="subtitle">
          Your interview performance and feedback
        </p>
      </div>

      <button
        className="outline-button"
        onClick={() => setActive('New interview')}
      >
        <ArrowLeft size={16} /> Back to interview
      </button>
    </div>

    
<div className="report-page-content">

  {reportLoading ? (
    <div className="report-loading">
      <Sparkles size={32} />
      <h3>Generating your final report...</h3>
      <p className="muted">
        Please wait while we evaluate your interview.
      </p>
    </div>
 
  ) : reportError ? (
  <div className="report-error">
    <p className="error-message">{reportError}</p>

    {reportError.toLowerCase().includes('failed') ? (
      <button
        className="primary-button"
        onClick={() => setActive('New interview')}
      >
        Start New Interview
      </button>
    ) : (
      <button
        className="primary-button"
        onClick={() => fetchFinalReport(createdInterview.id)}
      >
        Retry Report
      </button>
    )}
  </div>
  ) : finalReport ? (
    <div className="final-report-preview">


{/* 01 - Overall Score */}
      <section className="report-block report-overall-block">
        <div className="report-section-heading">
          <span>01.</span>
          <h2>Overall Score</h2>
        </div>

        <div className="report-score-area">
          <div className="report-score-circle">
            <div className="report-score-inner">
              <strong>
                {finalReport.overall_score ?? '—'}
              </strong>
              <span>OUT OF 100</span>
            </div>
          </div>
        </div>
      </section>


      {/* 02 - Questions & Evaluation */}
      <section className="report-block">
        <div className="report-section-heading">
          <span>02.</span>
          <h2>
            Interview Q&A & Evaluation
            ({finalReport.questions?.length || 0} Questions)
          </h2>
        </div>

        <div className="report-qa-grid">
          {finalReport.questions?.map((question, index) => (
            <article className="report-qa-card" key={question.id ?? index}>
              <div className="report-qa-main">
                <h3>
                  Q{question.sequence_number ?? index + 1}: {question.text}
                </h3>

                <div className="report-answer">
                  <strong>Your Answer</strong>
                  <p>
                    {question.answer?.text || 'No answer provided.'}
                  </p>
                </div>
              </div>

              <div className="report-qa-score">
                <span>Score</span>
                <strong>{question.answer?.score ?? '—'}</strong>
                <small>/10</small>
              </div>

{question.answer?.score < 9 && (

              <div className="report-better-answer">
                <span>Better Answer</span>
                <p>
                  {question.answer?.better_answer ||
                    'No suggested answer available.'}
                </p>
              </div>
)}
            </article>
          ))}
        </div>
      </section>

      {/* 03 - Interview Summary */}
      <section className="report-block">
        <div className="report-section-heading">
          <span>03.</span>
          <h2>Interview Summary</h2>
        </div>

        <div className="report-summary-grid">
          <article className="report-summary-card">
            <h3>Interview Overview</h3>
            <p>
              {finalReport.summary || 'No summary available.'}
            </p>
          </article>

          <article className="report-summary-card">
            <h3>Performance Highlights</h3>

            <div className="report-highlight-list">
              {finalReport.dimensions?.length > 0 ? (
                finalReport.dimensions.map((item, index) => (
                  <div key={item.dimension ?? index}>
                    <strong>
                      {item.dimension?.replaceAll('_', ' ')}
                    </strong>
                    <span>{item.score ?? 0}/100</span>
                  </div>
                ))
              ) : (
                <p>No performance details available.</p>
              )}
            </div>
          </article>
        </div>
      </section>

      

      {/* 04 - Improvement Areas */}
      <section className="report-block">
        <div className="report-section-heading">
          <span>04.</span>
          <h2>Improvement Areas</h2>
        </div>

        <div className="report-improvements-grid">
          {finalReport.improvement_areas?.length > 0 ? (
            finalReport.improvement_areas.map((item, index) => (
              <article className="report-improvement-card" key={index}>
                <h3>
                  {typeof item === 'string'
                    ? `Improvement ${index + 1}`
                    : item.area || item.name || `Improvement ${index + 1}`}
                </h3>

                <p>
                  {typeof item === 'string'
                    ? item
                    : item.recommendation ||
                      item.description ||
                      'Review this area to improve your performance.'}
                </p>
              </article>
            ))
          ) : (
            <p className="muted">
              No improvement areas available.
            </p>
          )}
        </div>
      </section>

      {/* 05 - Dimensions */}
      <section className="report-block">
        <div className="report-section-heading">
          <span>05.</span>
          <h2>Key Dimensions Scores & Evidence</h2>
        </div>

        <div className="report-dimensions-grid">
          {finalReport.dimensions?.length > 0 ? (
            finalReport.dimensions.map((item, index) => (
              <article
                className="report-dimension-card"
                key={item.dimension ?? index}
              >
                <h3>
                  {item.dimension?.replaceAll('_', ' ') || 'Dimension'}
                </h3>

                <div className="report-dimension-score">
                  <strong>{item.score ?? 0}</strong>
                  <span>/5</span>
                </div>

                <div className="report-dimension-progress">
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(5, item.score ?? 0)) * 20}%`
                    }}
                  />
                </div>

                <div className="report-evidence">
                  <strong>Evidence</strong>
                  <p>
                    {item.evidence || 'No evidence available.'}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="muted">
              No performance dimensions available.
            </p>
          )}
        </div>
      </section>

    </div>
  ) : (
    <p className="muted">No report available.</p>
  )}

</div>

  </section>

       
 ) : active === 'interview-details' ? (
  <section className="inner-page report-page">

    <div className="page-heading">
      <div>
        <div className="eyebrow">
          INTERVIEW DETAILS
          <span className="eyebrow-line" />
        </div>

        <h1>Interview #{selectedInterview?.id}</h1>

        <p className="subtitle">
          Complete interview history, answers and evaluation
        </p>
      </div>

      <button
        className="text-button"
        onClick={() => setActive('Interview history')}
      >
        <ArrowLeft size={16} /> Back to history
      </button>
    </div>

    {detailsLoading ? (
      <div className="report-loading">
        Loading interview details...
      </div>
    ) : detailsError ? (
      <div className="report-error">
        {detailsError}
      </div>
    ) : (
      <div className="report-page-content">

        {/* Interview Information */}
        <section className="report-block">
          <h2>Interview Information</h2>

          <p>
            <strong>Date:</strong>{' '}
            {selectedInterview?.started_at
              ? new Date(selectedInterview.started_at).toLocaleString()
              : 'Date unavailable'}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {selectedInterview?.status?.replaceAll('_', ' ')}
          </p>

          <p>
            <strong>Total Questions:</strong>{' '}
            {interviewQuestions.length}
          </p>
        </section>

        {/* Questions and Answers */}
        <section className="report-block">
          <h2>Questions & Answers</h2>

          {interviewQuestions.length === 0 ? (
            <p>No questions available for this interview.</p>
          ) : (
            interviewQuestions.map((question) => (
              <div
                className="report-qa-item"
                key={question.id}
              >
                <h3>
                  Question {question.sequence_number}
                </h3>

                <p>{question.text}</p>

                <div>
                  <strong>Your Answer</strong>
                  <p>
                    {question.answer?.text || 'No answer provided'}
                  </p>
                </div>

                {question.answer && (
                  <>
                    <p>
                      <strong>Evaluation Status:</strong>{' '}
                      {question.answer.evaluation_status || 'Unavailable'}
                    </p>

                    <p>
                      <strong>Score:</strong>{' '}
                      {question.answer.score ?? 'Not evaluated'}
                    </p>

                    {question.answer.better_answer && (
                      <div>
                        <strong>Suggested Better Answer</strong>
                        <p>{question.answer.better_answer}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </section>

        {/* Final Report */}
        {interviewDetailReport && (
          <>
            <section className="report-block">
              <h2>Final Report</h2>

              <p>
                <strong>Overall Score:</strong>{' '}
                {interviewDetailReport.overall_score ?? 'N/A'}
              </p>

              <p>
                <strong>Summary:</strong>
              </p>

              <p>{interviewDetailReport.summary}</p>
            </section>

            {/* Improvement Areas */}
            <section className="report-block">
              <h2>Improvement Areas</h2>

              {interviewDetailReport.improvement_areas?.length ? (
                interviewDetailReport.improvement_areas.map((area, index) => (
                  <p key={index}>
                    {typeof area === 'string'
                      ? area
                      : area.name || area.description || JSON.stringify(area)}
                  </p>
                ))
              ) : (
                <p>No improvement areas available.</p>
              )}
            </section>

            {/* Dimensions */}
            <section className="report-block">
              <h2>Performance Dimensions</h2>

              {interviewDetailReport.dimensions?.map((dimension, index) => (
                <div key={index}>
                  <h3>
                    {dimension.dimension?.replaceAll('_', ' ')}
                  </h3>

                  <p>
                    <strong>Score:</strong> {dimension.score}
                  </p>

                  <p>{dimension.evidence}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {!interviewDetailReport && (
          <section className="report-block">
            <h2>Final Report</h2>
            <p>
              A final report is not available for this interview.
            </p>
          </section>
        )}

      </div>
    )}
  </section>

   
   
   ) : active === 'Resumes' ? <section className="inner-page">
            <div className="page-heading">
              <div><div className="eyebrow">DOCUMENT LIBRARY <span className="eyebrow-line" /></div><h1>Resumes</h1><p className="subtitle">Upload your experience. Sparr uses extracted skills to tailor technical questions.</p></div>
            </div>

            <div className="card upload-card">
              <div className="section-kicker">UPLOAD A RESUME</div>
              <h2>Add a new resume</h2>
              <p className="muted">PDF or plain text (.txt) only · Maximum 5 MB per file</p>
              <label className="upload-drop">
                <FileText size={28} />
                <strong>{uploadBusy ? 'Uploading resume…' : 'Choose a PDF or TXT file'}</strong>
                <span>{uploadBusy ? 'Please wait' : 'Click to browse your computer'}</span>
                <input type="file" accept=".pdf,.txt,application/pdf,text/plain" disabled={uploadBusy} onChange={handleResumeUpload} />
              </label>
              <p className="muted small-note">Your file will be uploaded securely and queued for skill extraction.</p>
            </div>

            <div className="section-header">
              <div><div className="section-kicker">SAVED DOCUMENTS</div><h2>Your resumes <span className="count-pill">{resumes.length}</span></h2></div>
              <button className="text-button" onClick={fetchResumes} disabled={resumesLoading || uploadBusy}>Refresh</button>
            </div>

            {resumesLoading && <div className="card empty-state"><p>Loading your resumes…</p></div>}
            {resumesError && <div className="card empty-state" role="alert"><p>{resumesError}</p><button className="outline-button" onClick={fetchResumes}>Try again</button></div>}
            {!resumesLoading && !resumesError && resumes.length === 0 && (
              <div className="card empty-state"><FileText size={24} /><h2>No resumes yet</h2><p>Upload your first PDF or TXT resume to get started.</p></div>
            )}

            {!resumesLoading && !resumesError && resumes.length > 0 && (
              <div className="resume-list">
                {resumes.map(resume => (
                  <article className={`card resume-card ${selectedResume === resume.id ? 'resume-selected' : ''}`} key={resume.id}>
                    <div className="resume-file-icon"><FileText size={22} /></div>
                    <div className="resume-details">
                      <h3>{resume.title}</h3>
                      <p>{formatResumeDate(resume.created_at)}</p>
                      <div className="skill-chips"><span>{resumeStatusLabel(resume.parsing_status)}</span></div>
                      {resume.processing_error && <small role="alert">{resume.processing_error}</small>}
                    </div>
                    <div className="resume-actions">
                      <span className="ready-pill">
                        {resume.parsing_status === 'completed' ? <CircleCheck size={14} /> : <Sparkles size={14} />}
                        {resumeStatusLabel(resume.parsing_status)}
                      </span>
                      <button className="outline-button" onClick={() => setSelectedResume(resume.id)}>
                        {selectedResume === resume.id ? 'Selected' : 'Select resume'}
                      </button>

                      <button
  className="outline-button"
  onClick={() => {
    setSelectedResume(resume.id);
    fetchResumeDetails(resume.id);
  }}
>
  View skills
</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

{resumeDetailsLoading && (
  <div className="card empty-state">
    <p>Loading extracted skills...</p>
  </div>
)}

{resumeDetailsError && (
  <div className="card empty-state" role="alert">
    <p>{resumeDetailsError}</p>
  </div>
)}

{resumeDetails && (
  <section className="card job-form-card">
    <div className="section-header">
      <div>
        <div className="section-kicker">AI RESUME ANALYSIS</div>
        <h2>Extracted Skills</h2>
        <p className="muted">
          {resumeDetails.skills?.length || 0} skills detected
        </p>
      </div>
    </div>

    {resumeDetails.skills?.length > 0 ? (
      Object.entries(
        resumeDetails.skills.reduce((groups, skill) => {
          const category = skill.category || 'other';

          if (!groups[category]) {
            groups[category] = [];
          }

          groups[category].push(skill);

          return groups;
        }, {})
      ).map(([category, skills]) => (
        <div className="resume-skill-group" key={category}>
          <h3>{category.replace(/_/g, ' ')}</h3>

          <div className="skill-chips">
            {skills.map(skill => (
              <span key={skill.id}>
                {skill.name}
                {' · '}
                {typeof skill.confidence_score === 'number'
  ? `${Math.round(skill.confidence_score * 100)}%`
  : '—'}

              </span>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p className="muted">No skills were extracted from this resume.</p>
    )}
  </section>
)}


            <div className="notice-card">
              <LockKeyhole size={18} />
              <div>
                <strong>Your documents stay private</strong>
                <p>Only you can access your resumes. Resume deletion and file preview are not currently available.</p>
              </div>
            </div>
          </section> : active === 'Job descriptions' ? <section className="inner-page">
            <div className="page-heading job-page-heading">
              <div><div className="eyebrow">TARGET ROLE LIBRARY <span className="eyebrow-line" /></div><h1>Job descriptions</h1><p className="subtitle">Save target roles and extract the skills needed for each opportunity.</p></div>
              <button className="primary-button" onClick={() => setJobFormOpen(value => !value)}><Plus size={18}/>{jobFormOpen ? 'Close form' : 'Add job description'}</button>
            </div>
            {jobFormOpen && <form className="card job-form-card" onSubmit={saveJob}>
              <div className="section-header"><div><div className="section-kicker">NEW TARGET ROLE</div><h2>Add a job description</h2></div><button type="button" className="icon-button close-form" aria-label="Close form" onClick={resetJobForm}><X size={18}/></button></div>
              <div className="job-form-grid">
                <label className="field-label">Job title *<input required maxLength={255} value={jobForm.title} onChange={e=>setJobForm(v=>({...v,title:e.target.value}))} placeholder="e.g. Junior React Developer" /></label>
                <label className="field-label">Company *<input required value={jobForm.company} onChange={e=>setJobForm(v=>({...v,company:e.target.value}))} placeholder="e.g. Acme Technologies" /></label>
                <label className="field-label field-full">Job description / requirements *<textarea required rows={6} value={jobForm.description} onChange={e=>setJobForm(v=>({...v,description:e.target.value}))} placeholder="Paste the job responsibilities, required skills, qualifications, and technologies..." /></label>
              </div>
              <div className="form-footer"><span className="muted">The description will be sent for AI skill extraction.</span><div><button type="button" className="outline-button" onClick={resetJobForm}>Cancel</button><button className="primary-button" type="submit" disabled={jobSaveBusy}><CircleCheck size={16}/>{jobSaveBusy ? 'Saving…' : 'Save job description'}</button></div></div>
            </form>}
            <div className="job-toolbar"><div className="search-field"><Search size={17}/><input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Search by role or company..." aria-label="Search job descriptions" /></div><span className="count-pill">{jobDescriptions.length} saved</span><button className="text-button" onClick={fetchJobDescriptions} disabled={jobsLoading}>Refresh</button></div>
            {jobsLoading && <div className="card empty-state"><p>Loading job descriptions…</p></div>}
            {jobsError && <div className="card empty-state" role="alert"><p>{jobsError}</p><button className="outline-button" onClick={fetchJobDescriptions}>Try again</button></div>}
            {!jobsLoading && !jobsError && jobDescriptions.length === 0 && <div className="card empty-state"><Building2 size={24}/><h2>No job descriptions yet</h2><p>Add your first target role to extract its required skills.</p></div>}
            {!jobsLoading && !jobsError && <div className="job-list">{jobDescriptions.filter(job=>`${job.title} ${job.company_name}`.toLowerCase().includes(jobSearch.toLowerCase())).map(job=><article className={`card job-card ${selectedJobId === job.id ? 'resume-selected' : ''}`} key={job.id}>
              <div className="job-card-icon"><Building2 size={22}/></div><div className="job-card-content"><div className="job-card-title-row"><div><h2>{job.title}</h2><p className="job-company">{job.company_name}</p></div><span className="ready-pill">{job.parsing_status || 'Unknown'}</span></div><div className="job-card-meta"><span><FileText size={13}/> Added {formatResumeDate(job.created_at)}</span></div></div><div className="job-card-actions"><button className="outline-button" onClick={()=>setSelectedJobId(job.id)}>{selectedJobId === job.id ? 'Selected' : 'View details'}</button></div>
            </article>)}{jobDescriptions.filter(job=>`${job.title} ${job.company_name}`.toLowerCase().includes(jobSearch.toLowerCase())).length===0 && <div className="card empty-state"><Search size={24}/><h2>No matching job descriptions</h2><p>Try a different search, or add a new target role.</p></div>}</div>}
            {selectedJobId && <div className="card job-form-card"><div className="section-header"><div><div className="section-kicker">JOB DETAILS</div><h2>{selectedJobDetails?.title || 'Selected job description'}</h2></div><button className="text-button" onClick={()=>fetchJobDetails(selectedJobId)} disabled={jobDetailsLoading}>Refresh details</button></div>
              {jobDetailsLoading && !selectedJobDetails && <p className="muted">Loading job details…</p>}
              {selectedJobDetails && <><p className="job-company">{selectedJobDetails.company_name}</p><span className="ready-pill">{selectedJobDetails.parsing_status}</span><p className="job-description-preview">{selectedJobDetails.description}</p><h3>Extracted skills</h3>
                {selectedJobDetails.skills?.length ? <div className="skill-chips">{selectedJobDetails.skills.map(skill=><span key={skill.id}>{skill.name} · {skill.category} · {Math.round((skill.importance || 0)*100)}%</span>)}</div> : <p className="muted">{selectedJobDetails.parsing_status === 'failed' ? 'Skill extraction failed. Please contact the backend team.' : 'No skills extracted yet. This section refreshes automatically while extraction is pending.'}</p>}
              </>}




            </div>}


            <div className="notice-card"><LockKeyhole size={18}/><div><strong>Your job descriptions stay private</strong><p>Descriptions and extracted skills are loaded from your account. Editing and deletion are not available through the documented APIs.</p></div></div>
          
      
      
                </section>

          : active === 'Skill Roadmap' ? (
            <section className="inner-page">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    PERSONALIZED LEARNING PLAN
                    <span className="eyebrow-line" />
                  </div>
                  <h1>Skill Roadmap</h1>
                  <p className="subtitle">
                    Build the skills you're missing for your target job.
                  </p>
                </div>
              </div>

              <div className="card job-form-card">
                <h2>Your learning roadmap</h2>
                <p className="muted">
                  Your roadmap will be generated based on your skill gap analysis.
                </p>

                {!selectedResume || !selectedJobId ? (
                  <p className="muted">
                    Please select a resume and a target job first.
                  </p>
                ) : roadmapStatus === 'pending' || roadmapStatus === 'processing' ? (
                  <p className="muted">
                    Your learning roadmap is being generated...
                  </p>
                ) : roadmapStatus === 'failed' ? (
                  <p role="alert">
                    {roadmapError || 'Roadmap generation failed.'}
                  </p>
                ) : roadmapStatus === 'completed' ? (
                  roadmap?.length > 0 ? (
                   


<div className="roadmap-list">
  {roadmap.map((item, index) => (
    <details
      className="roadmap-card"
      key={item.skill_id ?? index}
      // open={index === 0}
    >
      <summary className="roadmap-card-header">
        <div className="roadmap-skill-info">
          <div className="roadmap-skill-icon">
            <BookOpen size={22} />
          </div>

          <div>
            <h3>{item.skill_name}</h3>
            <span className="roadmap-category">
              {item.category}
            </span>
          </div>
        </div>

        <div className="roadmap-meta">
          <span className="roadmap-duration">
            {item.estimated_duration}
          </span>
          <span className="roadmap-priority">
            Priority {item.priority}
          </span>
          <ChevronRight className="roadmap-chevron" size={20} />
        </div>
      </summary>

      <div className="roadmap-content">
        <div className="roadmap-description">
          <h4>{item.title}</h4>
          <p>
            Follow this learning path to improve your
            knowledge and meet the job requirements.
          </p>
        </div>

        <div className="roadmap-weeks">
          {item.steps?.map((step, stepIndex) => (
            <div className="roadmap-week" key={stepIndex}>
              <div className="roadmap-week-number">
                Week {step.week}
              </div>

              <div className="roadmap-week-content">
                <h4>{step.title}</h4>

                <ul>
                  {step.topics?.map((topic, topicIndex) => (
                    <li key={topicIndex}>
                      <CircleCheck size={16} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {item.resources?.length > 0 && (
          <div className="roadmap-resources">
            <h4>
              <BookOpen size={18} />
              Learning Resources
            </h4>

            {item.resources.map((resource, resourceIndex) => (
              <a
                className="roadmap-resource-link"
                key={resourceIndex}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <strong>{resource.title}</strong>
                  <span>Open learning resource</span>
                </div>

                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        )}
      </div>
    </details>
  ))}
</div>

                  ) : (
                    <p className="muted">
                      Great! No missing skills were found for this job.
                    </p>
                  )
                ) : (
                  <p className="muted">
                    No roadmap data is available yet.
                  </p>
                )}
              </div>
            </section>
          )

      : active === 'Interview history' ? (
  <section className="inner-page">
    <div className="page-heading">
      <div>
        <div className="eyebrow">
          SPARR WORKSPACE <span className="eyebrow-line" />
        </div>
        <h1>Interview history</h1>
        <p className="subtitle"         style={{marginBottom:30}}
>
          Review your past attempts and track your progress.
        </p>
      </div>
      <button
        className="primary-button"
        onClick={() => setActive('New interview')}
        style={{marginBottom:30}}
      >
        <Plus size={18} /> New interview
      </button>
    </div>

   
    <section className="history-stats">
  <div className="card history-stat-card">
    <span>Total sessions</span>
    <strong>{totalSessions}</strong>
    <p>
      {totalSessions === 0
        ? 'No sessions yet'
        : 'Total interview attempts'}
    </p>
  </div>

  <div className="card history-stat-card">
    <span>Completed</span>
    <strong>{completedCount}</strong>
    <p>Completed attempts</p>
  </div>

  <div className="card history-stat-card">
  <span>Average score</span>

  <strong>
    {averageScore !== null ? averageScore.toFixed(1) : '—'}
  </strong>

  <p>
    {averageScoreCount === 1
      ? 'Based on 1 report'
      : `Based on ${averageScoreCount} reports`}
  </p>
</div>
</section>

    <section className="card history-content">
      <div className="table-heading">
        <div>
          <div className="section-kicker">YOUR PRACTICE</div>
          <h2>All interview sessions</h2>
        </div>
      </div>

      
      <div className="history-content-body">

  {historyLoading ? (
    <div className="history-empty-state">
      <p>Loading interview sessions...</p>
    </div>
  ) : historyError ? (
    <div className="history-empty-state">
      <p className="error-message">{historyError}</p>
    </div>
  ) : interviews.length === 0 ? (
    <div className="history-empty-state">
      <div className="empty-interviews-icon">
        <History size={26} />
      </div>

      <h3>No interview sessions yet</h3>

      <p>
        Your interview attempts will appear here.
        Start your first practice session to begin tracking your progress.
      </p>

      <button
        className="dark-button"
        onClick={() => setActive('New interview')}
      >
        Start your first interview <ArrowRight size={16} />
      </button>
    </div>
  ) : (
    <div className="history-list">
      {interviews.map(interview => (
        <div className="history-item" key={interview.id} 
           onClick={() => fetchInterviewDetails(interview)}

    style={{ cursor: 'pointer' }}>
          <div className="history-item-info">
            <h3>Interview #{interview.id}</h3>

            <p>
              {interview.status.replace('_', ' ')}
            </p>

            <span>
              {interview.completed_at
                ? new Date(interview.completed_at).toLocaleDateString()
                : interview.started_at
                  ? new Date(interview.started_at).toLocaleDateString()
                  : 'Date unavailable'}
            </span>
          </div>

          <div className="history-item-details">
            <span className={`status-badge ${interview.status}`}>
              {interview.status.replace('_', ' ')}
            </span>

            <span>
              {interview.total_questions} Questions
            </span>
          </div>
        </div>
      ))}
    </div>
  )}

</div>
    </section>
  </section>
) : <section className="inner-page">
  <div className="page-heading">
    <div>
      <div className="eyebrow">
        SPARR WORKSPACE <span className="eyebrow-line" />
      </div>
     
        {active !== 'New interview' && <h1>{active}</h1>}
<p className="subtitle">
  {active === 'New interview'
          ? ''
          : active === 'Profile & settings'
            ? 'Manage your profile and account preferences.'
            : 'Review your skill gaps before starting your interview.'}
      </p>
    </div>
  </div>

 

  {active === 'New interview' ? (
  <section className="inner-page">
    <div className="page-heading">
      <div>
        <div className="eyebrow">
          INTERVIEW PREPARATION <span className="eyebrow-line" />
        </div>

        <h1>New interview</h1>

        <p className="subtitle">
          Choose your resume and target job to prepare for a personalized interview.
        </p>
      </div>
    </div>

    
    {createdInterview ? (
  <div className="card placeholder-workspace interview-ready-card">
    <div className="placeholder-icon">
      <Sparkles size={24} />
    </div>

  
    <h2>
  {createdInterview.status === 'ready'
    ? 'Your interview is ready!'
    : createdInterview.status === 'failed'
      ? 'Question generation failed'
      : 'Preparing your interview...'}
</h2>

<p className="muted">
  {createdInterview.status === 'ready'
    ? 'Answer the questions below to practice for your target role.'
    : createdInterview.status === 'failed'
      ? 'We could not generate your questions. Please try again.'
      : 'Sparr is generating your personalized interview questions.'}
</p>

    {questionsLoading && (
      <p className="muted">Loading interview questions...</p>
    )}

   
    {(questionsError || interviewError) && (
  <div className="interview-error" role="alert">
    <p className="muted">
      {interviewError || questionsError}
    </p>

    <button
      className="primary-button"
      // onClick={handleStartInterview}
      // disabled={interviewCreating}
            onClick={handleRetryInterview}
        disabled={interviewCreating || !failedInterviewId}

    >
      {interviewCreating ? 'Trying again...' : 'Try Again'}
      <ArrowRight size={16} />
    </button>
  </div>
)}

    {interviewQuestions.length > 0 && (
      <div className="resume-skill-group">
        <h3>
          Interview Questions ({interviewQuestions.length})
        </h3>

        <div className="interview-questions-list">
          
{questionLoading ? (
  <p className="muted">Loading question...</p>
) : interviewCompleted && currentQuestion === null ? (


<div className="interview-completed">
  <Sparkles size={32} />

  <h2>Interview Completed!</h2>

  <p className="muted">
    Great job! You have completed all interview questions.
  </p>

  
 
{/* <button
  className="primary-button"
 
  onClick={() => {
  if (finalReport) {
    setActive('report');
  } else {
    fetchFinalReport(createdInterview.id);
  }
}}
>
  View Final Report
</button> */}
<button
  className="primary-button"
  onClick={() => {
    if (createdInterview?.id) {
      fetchFinalReport(createdInterview.id);
    }
  }}
  disabled={reportLoading || !createdInterview?.id}
>
  {reportLoading ? 'Loading Report...' : 'View Final Report'}
</button>

  

{/* Final Report Modal */}
{showReportModal && (
  <div
    className="report-modal-overlay"
    onClick={() => setShowReportModal(false)}
  >
    <div
      className="report-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="report-modal-header">
        <div>
          <h2>Your Final Report</h2>
          <p className="muted">
            Your interview performance and feedback
          </p>
        </div>

        <button
          className="report-close-button"
          onClick={() => setShowReportModal(false)}
          aria-label="Close report"
        >
          <X size={22} />
        </button>
      </div>

      <div className="report-modal-content">

        {reportLoading ? (
          <div className="report-loading">
            <Sparkles size={32} />
            <h3>Generating your final report...</h3>
            <p className="muted">
              Please wait while we evaluate your interview.
            </p>
          </div>
        ) : reportError ? (
          <div className="report-error">
            <p className="error-message">{reportError}</p>

            <button
              className="primary-button"
              onClick={() => fetchFinalReport(createdInterview.id)}
            >
              Retry report
            </button>
          </div>
        ) : finalReport ? (
          <div className="final-report-preview">

            {/* Overall Score */}
            <div className="report-header">
              <div className="overall-score">
                <h2>
                  {finalReport.overall_score ?? '—'}
                  <small>/100</small>
                </h2>
                <p>Overall Interview Score</p>
              </div>
            </div>

            {/* Summary */}
            <section className="report-section">
              <h3>Interview Summary</h3>
              <p>
                {finalReport.summary || 'No summary available.'}
              </p>
            </section>

            {/* Performance Dimensions */}
            <section className="report-section">
              <h3>Performance Dimensions</h3>

              {finalReport.dimensions?.length > 0 ? (
                finalReport.dimensions.map((item, index) => (
                  <div
                    className="dimension-item"
                    key={item.dimension ?? index}
                  >
                    <div className="dimension-header">
                      <strong>
                        {item.dimension?.replaceAll('_', ' ')}
                      </strong>

                      <span>{item.score ?? 0}/100</span>
                    </div>

                    <p>
                      {item.evidence || 'No evidence available.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="muted">
                  No performance dimensions available.
                </p>
              )}
            </section>

            {/* Improvement Areas */}
<section className="report-section">
  <h3>Improvement Areas</h3>

  {finalReport.improvement_areas?.length > 0 ? (
    finalReport.improvement_areas.map((item, index) => (
      <div className="improvement-item" key={index}>
        <strong>{item.area || 'Improvement Area'}</strong>

        {item.recommendation && (
          <p>{item.recommendation}</p>
        )}
      </div>
    ))
  ) : (
    <p className="muted">
      No improvement areas provided.
    </p>
  )}
</section>
           

            {/* Question Evaluation */}
            <section className="report-section">
              <h3>Question Evaluation</h3>

              {finalReport.questions?.length > 0 ? (
                finalReport.questions.map((question, index) => (
                  <div
                    className="question-evaluation"
                    key={question.id ?? index}
                  >
                    <h4>
                      Question {question.sequence_number ?? index + 1}
                    </h4>

                    <p>{question.text}</p>

                    {question.answer ? (
                      <>
                        <div className="answer-block">
                          <strong>Your Answer</strong>
                          <p>
                            {question.answer.text || 'No answer provided.'}
                          </p>
                        </div>

                        <div className="answer-score">
                          <strong>Score:</strong>{' '}
                          {question.answer.score ?? '—'}
                        </div>

                        <div className="better-answer">
                          <strong>Suggested Better Answer</strong>
                          <p>
                            {question.answer.better_answer ||
                              'No suggested answer available.'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="muted">No answer available.</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="muted">
                  No question evaluations available.
                </p>
              )}
            </section>

          </div>
        ) : null}

      </div>
    </div>
  </div>
)}



  <button
    className="primary-button"
      style={{ marginTop: '20px' }}

    onClick={handleStartAnotherInterview}
  >
    Start another interview <ArrowRight size={16} />
  </button>
</div>
) : currentQuestion ? (
  <div className="interview-question-panel">

    <div className="interview-question-meta">
      <span>QUESTION {questionNumber} OF 10</span>
      <span>{Math.round((questionNumber / 10) * 100)}%</span>
    </div>

    <div className="interview-progress">
      <div
        className="interview-progress-fill"
        style={{ width: `${(questionNumber / 10) * 100}%` }}
      />
    </div>

    <h2 className="interview-question-text">
      {currentQuestion.text}
    </h2>

    <label className="interview-answer-label">
      Your Answer
    </label>

    <textarea
      className="interview-answer-field"
      value={currentAnswer}
      onChange={(e) => setCurrentAnswer(e.target.value)}
      placeholder="Take your time and write your answer here..."
    />

    <div className="interview-submit-wrapper">
      <button
        className="primary-button interview-submit-button"
        onClick={handleSubmitAnswer}
        disabled={!currentAnswer.trim() || answerSubmitting}
      >
        {answerSubmitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>

  </div>
) : null}
        </div>
      </div>
    )}
  </div>
) : (
      <>
        <div className="card job-form-card">
          <div className="section-kicker">STEP 1 · SELECT DOCUMENTS</div>
          <h2>Choose your experience</h2>

          <div className="job-form-grid">
            <label className="field-label">
              Your resume *

              <select
                value={selectedResume ?? ''}
              
            onChange={(e) => {
  const resumeId = e.target.value ? Number(e.target.value) : null;

  setSelectedResume(resumeId);
  setGapAnalysis(null);
  setGapAnalysisError('');

 
}}
              >
                <option value="">Select a resume</option>

                {resumes.map(resume => (
                  <option
                    key={resume.id}
                    value={resume.id}
                    disabled={resume.parsing_status !== 'completed'}
                  >
                    {resume.title} — {resumeStatusLabel(resume.parsing_status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Target job *

              <select
                value={selectedJobId ?? ''}
              
           onChange={(e) => {
  const jobId = e.target.value ? Number(e.target.value) : null;

  setSelectedJobId(jobId);
  setGapAnalysis(null);
  setGapAnalysisError('');

  
}}
              >
                <option value="">Select a job description</option>

                {jobDescriptions.map(job => (
                  <option
                    key={job.id}
                    value={job.id}
                    disabled={job.parsing_status !== 'completed'}
                  >
                    {job.title} — {job.company_name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!resumes.length && (
            <p className="muted">
              You haven't uploaded a resume yet.
              <button
                className="text-button"
                onClick={() => setActive('Resumes')}
              >
                Upload resume
              </button>
            </p>
          )}

          {!jobDescriptions.length && (
            <p className="muted">
              You haven't added a job description yet.
              <button
                className="text-button"
                onClick={() => setActive('Job descriptions')}
              >
                Add job description
              </button>
            </p>
          )}
        </div>

       


<div className="card job-form-card">
  <div className="section-kicker">SKILL GAP OVERVIEW</div>

  <h2>Your skill match</h2>

  {gapAnalysisCreating ? (
    <p className="muted">Analyzing your skills...</p>
  ) : gapAnalysisLoading ? (
    <p className="muted">Loading previous skill gap analysis...</p>
  ) : gapAnalysis ? (
    <div className="resume-skill-group">
      <h3>
        Overall Match: {gapAnalysis.match_percentage}%
      </h3>

      <p className="muted">
        {gapAnalysis.matching_skills_count} matching skills ·{' '}
        {gapAnalysis.missing_skills_count} missing skills
      </p>

      <h3>Matching skills</h3>
      <div className="skill-chips">
        {gapAnalysis.matching_skills?.map(skill => (
          <span key={skill.id}>{skill.name}</span>
        ))}
      </div>

      <h3>Missing skills</h3>
      <div className="skill-chips">
        {gapAnalysis.missing_skills?.map(skill => (
          <span key={skill.id}>{skill.name}</span>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <p className="muted">
        {gapAnalysisError ||
          'Select your resume and target job, then analyze your skills.'}
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={handleAnalyzeSkills}
        disabled={
          !selectedResume ||
          !selectedJobId ||
          gapAnalysisCreating ||
          gapAnalysisLoading
        }
      >
        {gapAnalysisError ? 'Try Again' : 'Analyze Skills'}
      </button>
    </div>
  )}
</div>



      

        <div className="form-footer">
         
          {!createdInterview && interviewError && (
  <div className="interview-error" role="alert">
    <p className="muted">{interviewError}</p>

    <button
      className="primary-button"
      onClick={handleStartInterview}
      disabled={interviewCreating}
    >
      {interviewCreating ? 'Trying again...' : 'Try Again'}
      <ArrowRight size={16} />
    </button>
  </div>
)}

<button
  className="primary-button"
  onClick={handleStartInterview}
  disabled={!gapAnalysis || gapAnalysisLoading ||   gapAnalysisCreating ||
interviewCreating}
>
  {interviewCreating ? 'Creating interview...' : 'Start Interview'}
 
  <ArrowRight size={16} />
</button>

  


        </div>
      </>
    )}
  </section>
) : active === 'Profile & settings' ? (
  <div className="profile-settings">

    <section className="card profile-card">
      <div className="section-kicker">YOUR ACCOUNT</div>

      <div className="profile-user">
        <div className="profile-avatar">{initials}</div>

        <div>
          <h2>{displayName}</h2>
          <p className="muted">
            {currentUser?.email || 'Email not available'}
          </p>
        </div>
      </div>
    </section>

    <section className="card settings-card">
      <div className="section-kicker">ACCOUNT INFORMATION</div>
      <h2>Personal information</h2>

      <div className="profile-fields">
        <div className="profile-field">
          <label>Full name</label>
          <div>{displayName || 'Not available'}</div>
        </div>

        <div className="profile-field">
          <label>Email address</label>
          <div>{currentUser?.email || 'Not available'}</div>
        </div>
      </div>
    </section>

    <section className="card settings-card">
      <div className="section-kicker">PREFERENCES</div>
      <h2>Account preferences</h2>

      <div className="setting-row">
        <div>
          <strong>Email notifications</strong>
          <p className="muted">Notification preferences will be available soon.</p>
        </div>
        <span className="coming-soon">Coming soon</span>
      </div>

      <div className="setting-row">
        <div>
          <strong>Password & security</strong>
          <p className="muted">Manage your password and account security.</p>
        </div>
        <span className="coming-soon">Coming soon</span>
      </div>
    </section>

    <div className="profile-back">
      <button
        className="outline-button"
        onClick={() => setActive('Dashboard')}
      >
        Back to dashboard <ArrowRight size={15} />
      </button>
    </div>

  </div>
) : (
  <div className="card placeholder-workspace">
    <div className="placeholder-icon">
      <Sparkles size={24} />
    </div>

    <h2>
      {active === 'New interview'
        ? 'Start a personalized practice session'
        : `Let’s build ${active.toLowerCase()}`}
    </h2>

    <p className="muted">
      This section is next in the development plan.
      Your dashboard, resume library, and job-description library
      are available now. Backend features will be connected separately.
    </p>

    <div className="placeholder-actions">
      <button
        className="outline-button"
        onClick={() => setActive('Resumes')}
      >
        View resumes <ArrowRight size={15} />
      </button>

      <button
        className="outline-button"
        onClick={() => setActive('Job descriptions')}
      >
        View job descriptions <ArrowRight size={15} />
      </button>

      <button
        className="primary-button"
        onClick={() => setActive('Dashboard')}
      >
        Back to dashboard
      </button>
    </div>
  </div>
)}
</section>}
          </main>
      </div>
      {notice && <div className="toast" role="status"><CircleCheck size={17} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
  );
}

export default App;



