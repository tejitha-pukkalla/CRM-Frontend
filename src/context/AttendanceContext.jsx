// import { createContext, useState, useEffect, useCallback } from 'react';
// import { getCurrentStatus } from '../services/attendance.service';

// export const AttendanceContext = createContext();

// export const AttendanceProvider = ({ children }) => {
//   const [attendanceState, setAttendanceState] = useState({
//     isClockedIn: false,
//     isOnBreak: false,
//     activeBreak: null,
//     attendance: null,
//     loading: true,
//     error: null
//   });

//   const [workingTime, setWorkingTime] = useState(0); // in seconds
//   const [breakTime, setBreakTime] = useState(0); // in seconds

//   // Fetch current attendance status
//   const fetchStatus = useCallback(async () => {
//     try {
//       const response = await getCurrentStatus();
//       const { isClockedIn, isOnBreak, activeBreak, attendance } = response.data;

//       setAttendanceState({
//         isClockedIn,
//         isOnBreak,
//         activeBreak,
//         attendance,
//         loading: false,
//         error: null
//       });

//       // Initialize timers
//       if (isClockedIn && attendance) {
//         const loginTime = new Date(attendance.loginTime);
//         const elapsed = Math.floor((Date.now() - loginTime) / 1000);
//         setWorkingTime(elapsed);

//         if (isOnBreak && activeBreak) {
//           const breakStart = new Date(activeBreak.startTime);
//           const breakElapsed = Math.floor((Date.now() - breakStart) / 1000);
//           setBreakTime(breakElapsed);
//         }
//       }
//     } catch (err) {
//       setAttendanceState(prev => ({
//         ...prev,
//         loading: false,
//         error: err.message || 'Failed to fetch attendance status'
//       }));
//     }
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     fetchStatus();
//   }, [fetchStatus]);

//   // Timer for working time
//   useEffect(() => {
//     if (!attendanceState.isClockedIn || attendanceState.isOnBreak) return;

//     const interval = setInterval(() => {
//       setWorkingTime(prev => prev + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [attendanceState.isClockedIn, attendanceState.isOnBreak]);

//   // Timer for break time
//   useEffect(() => {
//     if (!attendanceState.isOnBreak) {
//       setBreakTime(0);
//       return;
//     }

//     const interval = setInterval(() => {
//       setBreakTime(prev => prev + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [attendanceState.isOnBreak]);

//   // Format time as HH:MM:SS
//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   // Update state after clock-in
//   const updateAfterClockIn = (attendanceData) => {
//     setAttendanceState({
//       isClockedIn: true,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: attendanceData,
//       loading: false,
//       error: null
//     });
//     setWorkingTime(0);
//     setBreakTime(0);
//   };

//   // Update state after clock-out
//   const updateAfterClockOut = () => {
//     setAttendanceState({
//       isClockedIn: false,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: null,
//       loading: false,
//       error: null
//     });
//     setWorkingTime(0);
//     setBreakTime(0);
//   };

//   // Update state after starting break
//   const updateAfterBreakStart = (attendanceData) => {
//     const activeBreak = attendanceData.breaks.find(b => b.isActive);
//     setAttendanceState(prev => ({
//       ...prev,
//       isOnBreak: true,
//       activeBreak,
//       attendance: attendanceData
//     }));
//     setBreakTime(0);
//   };

//   // Update state after ending break
//   const updateAfterBreakEnd = (attendanceData) => {
//     setAttendanceState(prev => ({
//       ...prev,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: attendanceData
//     }));
//     setBreakTime(0);
//   };

//   const value = {
//     ...attendanceState,
//     workingTime,
//     breakTime,
//     formattedWorkingTime: formatTime(workingTime),
//     formattedBreakTime: formatTime(breakTime),
//     fetchStatus,
//     updateAfterClockIn,
//     updateAfterClockOut,
//     updateAfterBreakStart,
//     updateAfterBreakEnd
//   };

//   return (
//     <AttendanceContext.Provider value={value}>
//       {children}
//     </AttendanceContext.Provider>
//   );
// };












































// import { createContext, useState, useEffect, useCallback } from 'react';
// import { getCurrentStatus } from '../services/attendance.service';

// export const AttendanceContext = createContext();

// export const AttendanceProvider = ({ children }) => {
//   const [attendanceState, setAttendanceState] = useState({
//     isClockedIn: false,
//     isOnBreak: false,
//     activeBreak: null,
//     attendance: null,
//     loading: true,
//     error: null
//   });

//   const [workingTime, setWorkingTime] = useState(0);
//   const [breakTime, setBreakTime] = useState(0);

//   // 🔥 CRITICAL FIX: Reset function
//   const resetAttendanceState = useCallback(() => {
//     console.log('🔄 [AttendanceContext] RESETTING attendance state');
//     setAttendanceState({
//       isClockedIn: false,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: null,
//       loading: false,
//       error: null
//     });
//     setWorkingTime(0);
//     setBreakTime(0);
//   }, []);

//   // Fetch current attendance status
//   const fetchStatus = useCallback(async () => {
//     try {
//       console.log('🔍 [AttendanceContext] Fetching attendance status...');
      
//       const response = await getCurrentStatus();
//       const { isClockedIn, isOnBreak, activeBreak, attendance } = response.data;

//       console.log('✅ [AttendanceContext] Status received:', {
//         isClockedIn,
//         isOnBreak,
//         attendanceId: attendance?._id,
//         userId: attendance?.user?._id || attendance?.user
//       });

//       setAttendanceState({
//         isClockedIn,
//         isOnBreak,
//         activeBreak,
//         attendance,
//         loading: false,
//         error: null
//       });

//       // Initialize timers
//       if (isClockedIn && attendance) {
//         const loginTime = new Date(attendance.loginTime);
//         const elapsed = Math.floor((Date.now() - loginTime) / 1000);
//         setWorkingTime(elapsed);

//         if (isOnBreak && activeBreak) {
//           const breakStart = new Date(activeBreak.startTime);
//           const breakElapsed = Math.floor((Date.now() - breakStart) / 1000);
//           setBreakTime(breakElapsed);
//         }
//       } else {
//         setWorkingTime(0);
//         setBreakTime(0);
//       }
//     } catch (err) {
//       console.error('❌ [AttendanceContext] Error fetching status:', err);
//       setAttendanceState(prev => ({
//         ...prev,
//         loading: false,
//         error: err.message || 'Failed to fetch attendance status'
//       }));
//     }
//   }, []);

//   // 🔥 CRITICAL FIX: Listen for auth changes (BOTH logout AND login)
//   useEffect(() => {
//     const handleLogout = () => {
//       console.log('🚪 [AttendanceContext] Logout detected - clearing state');
//       resetAttendanceState();
//     };

//     const handleLogin = () => {
//       console.log('🔑 [AttendanceContext] Login detected - fetching fresh state');
//       fetchStatus();
//     };

//     window.addEventListener('auth:logout', handleLogout);
//     window.addEventListener('auth:login', handleLogin); // 🔥 THIS WAS MISSING!
    
//     return () => {
//       window.removeEventListener('auth:logout', handleLogout);
//       window.removeEventListener('auth:login', handleLogin); // 🔥 THIS WAS MISSING!
//     };
//   }, [resetAttendanceState, fetchStatus]);

//   // 🔥 CRITICAL FIX: Reset and fetch on mount/user change
//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       console.log('🔑 [AttendanceContext] Token found - fetching status');
//       fetchStatus();
//     } else {
//       console.log('🚫 [AttendanceContext] No token - resetting state');
//       resetAttendanceState();
//     }
//   }, [fetchStatus, resetAttendanceState]);

//   // Timer for working time
//   useEffect(() => {
//     if (!attendanceState.isClockedIn || attendanceState.isOnBreak) return;

//     const interval = setInterval(() => {
//       setWorkingTime(prev => prev + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [attendanceState.isClockedIn, attendanceState.isOnBreak]);

//   // Timer for break time
//   useEffect(() => {
//     if (!attendanceState.isOnBreak) {
//       setBreakTime(0);
//       return;
//     }

//     const interval = setInterval(() => {
//       setBreakTime(prev => prev + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [attendanceState.isOnBreak]);

//   // Format time as HH:MM:SS
//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   // Update state after clock-in
//   const updateAfterClockIn = (attendanceData) => {
//     console.log('✅ [AttendanceContext] Clock-in successful');
//     setAttendanceState({
//       isClockedIn: true,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: attendanceData,
//       loading: false,
//       error: null
//     });
//     setWorkingTime(0);
//     setBreakTime(0);
//   };

//   // Update state after clock-out
//   const updateAfterClockOut = () => {
//     console.log('✅ [AttendanceContext] Clock-out successful');
//     resetAttendanceState();
//   };

//   // Update state after starting break
//   const updateAfterBreakStart = (attendanceData) => {
//     console.log('✅ [AttendanceContext] Break started');
//     const activeBreak = attendanceData.breaks.find(b => b.isActive);
//     setAttendanceState(prev => ({
//       ...prev,
//       isOnBreak: true,
//       activeBreak,
//       attendance: attendanceData
//     }));
//     setBreakTime(0);
//   };

//   // Update state after ending break
//   const updateAfterBreakEnd = (attendanceData) => {
//     console.log('✅ [AttendanceContext] Break ended');
//     setAttendanceState(prev => ({
//       ...prev,
//       isOnBreak: false,
//       activeBreak: null,
//       attendance: attendanceData
//     }));
//     setBreakTime(0);
//   };

//   const value = {
//     ...attendanceState,
//     workingTime,
//     breakTime,
//     formattedWorkingTime: formatTime(workingTime),
//     formattedBreakTime: formatTime(breakTime),
//     fetchStatus,
//     resetAttendanceState, // 🔥 EXPOSE RESET FUNCTION
//     updateAfterClockIn,
//     updateAfterClockOut,
//     updateAfterBreakStart,
//     updateAfterBreakEnd
//   };

//   return (
//     <AttendanceContext.Provider value={value}>
//       {children}
//     </AttendanceContext.Provider>
//   );
// };













import { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentStatus } from '../services/attendance.service';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceState, setAttendanceState] = useState({
    isClockedIn: false,
    isOnBreak: false,
    activeBreak: null,
    attendance: null,
    loading: true,
    error: null
  });

  const [workingTime, setWorkingTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  // 🔥 CRITICAL FIX: Reset function
  const resetAttendanceState = useCallback(() => {
    console.log('🔄 [AttendanceContext] Resetting state');
    setAttendanceState({
      isClockedIn: false,
      isOnBreak: false,
      activeBreak: null,
      attendance: null,
      loading: false,
      error: null
    });
    setWorkingTime(0);
    setBreakTime(0);
  }, []);

  // Fetch current attendance status
  const fetchStatus = useCallback(async () => {
    try {
      console.log('🔍 [AttendanceContext] Fetching status...');
      
      const response = await getCurrentStatus();
      const { isClockedIn, isOnBreak, activeBreak, attendance } = response.data;

      console.log('✅ [AttendanceContext] Status received:', {
        isClockedIn,
        isOnBreak,
        attendanceId: attendance?._id
      });

      setAttendanceState({
        isClockedIn,
        isOnBreak,
        activeBreak,
        attendance,
        loading: false,
        error: null
      });

      // Initialize timers
      if (isClockedIn && attendance) {
        const loginTime = new Date(attendance.loginTime);
        const elapsed = Math.floor((Date.now() - loginTime) / 1000);
        setWorkingTime(elapsed);

        if (isOnBreak && activeBreak) {
          const breakStart = new Date(activeBreak.startTime);
          const breakElapsed = Math.floor((Date.now() - breakStart) / 1000);
          setBreakTime(breakElapsed);
        } else {
          setBreakTime(0);
        }
      } else {
        setWorkingTime(0);
        setBreakTime(0);
      }
    } catch (err) {
      console.error('❌ [AttendanceContext] Error:', err);
      setAttendanceState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch attendance status'
      }));
    }
  }, []);

  // 🔥 CRITICAL FIX: Listen for BOTH logout AND login events
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 [AttendanceContext] Logout detected');
      resetAttendanceState();
    };

    const handleLogin = () => {
      console.log('🔑 [AttendanceContext] Login detected');
      fetchStatus();
    };

    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:login', handleLogin);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:login', handleLogin);
    };
  }, [resetAttendanceState, fetchStatus]);

  // 🔥 CRITICAL FIX: Initial fetch on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('🔐 [AttendanceContext] Token found - fetching status');
      fetchStatus();
    } else {
      console.log('🚫 [AttendanceContext] No token - resetting state');
      resetAttendanceState();
    }
  }, [fetchStatus, resetAttendanceState]);

  // Timer for working time
  useEffect(() => {
    if (!attendanceState.isClockedIn || attendanceState.isOnBreak) return;

    const interval = setInterval(() => {
      setWorkingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [attendanceState.isClockedIn, attendanceState.isOnBreak]);

  // Timer for break time
  useEffect(() => {
    if (!attendanceState.isOnBreak) {
      setBreakTime(0);
      return;
    }

    const interval = setInterval(() => {
      setBreakTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [attendanceState.isOnBreak]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Update state after clock-in
  const updateAfterClockIn = (attendanceData) => {
    console.log('✅ [AttendanceContext] Clock-in successful');
    setAttendanceState({
      isClockedIn: true,
      isOnBreak: false,
      activeBreak: null,
      attendance: attendanceData,
      loading: false,
      error: null
    });
    setWorkingTime(0);
    setBreakTime(0);
  };

  // Update state after clock-out
  const updateAfterClockOut = () => {
    console.log('✅ [AttendanceContext] Clock-out successful');
    resetAttendanceState();
  };

  // Update state after starting break
  const updateAfterBreakStart = (attendanceData) => {
    console.log('✅ [AttendanceContext] Break started');
    const activeBreak = attendanceData.breaks.find(b => b.isActive);
    setAttendanceState(prev => ({
      ...prev,
      isOnBreak: true,
      activeBreak,
      attendance: attendanceData
    }));
    setBreakTime(0);
  };

  // Update state after ending break
  const updateAfterBreakEnd = (attendanceData) => {
    console.log('✅ [AttendanceContext] Break ended');
    setAttendanceState(prev => ({
      ...prev,
      isOnBreak: false,
      activeBreak: null,
      attendance: attendanceData
    }));
    setBreakTime(0);
  };

  const value = {
    ...attendanceState,
    workingTime,
    breakTime,
    formattedWorkingTime: formatTime(workingTime),
    formattedBreakTime: formatTime(breakTime),
    fetchStatus,
    resetAttendanceState,
    updateAfterClockIn,
    updateAfterClockOut,
    updateAfterBreakStart,
    updateAfterBreakEnd
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};