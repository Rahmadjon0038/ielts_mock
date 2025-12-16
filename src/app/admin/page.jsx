'use client'
import BannerComponent from '@/components/banner/Banner'
import { GlobalContainer } from '@/globalStyle'
import React, { useEffect, useState } from 'react'
import {
  ActiveButton, CardItem, CardList,
  CardTitle, Container,
  ViewButton
} from './style'
import Link from 'next/link'

import { useaddMonth, usedeleteMonth, usegetMonth } from '@/hooks/mockMonth'
import Loader from '@/components/loader/Loader'
import { useAddActiveMonhId, useLatestMonth } from '@/hooks/useLatestMonth'
import Cookies from 'js-cookie'
import NoResult from '@/components/NoResult'
import DeleteMock from '@/components/admin/CreateMockModal/DeleteMock'
import CreateMockModal from '@/components/admin/CreateMockModal/CreateMockModal'

function Adminpage() {
  const { data: allMonths, isLoading } = usegetMonth();
  const { data: activeMonth, refetch } = useLatestMonth(); // <- active holatni olish
  const addMonthMuation = useaddMonth();
  const deleteMonthMuation = usedeleteMonth();
  const activeAddMutation = useAddActiveMonhId(); // <- aktiv qilish funksiyasi
  const [activeMockId, setActiveMockId] = useState(null);

  useEffect(() => {
    const savedMockId = Cookies.get('activemonth');
    if (savedMockId) {
      setActiveMockId(Number(savedMockId));
    }
  }, []);

  const handleActive = (mockId) => {
    const isSame = activeMockId === mockId;
    const newValue = isSame ? null : mockId;

    setActiveMockId(newValue);

    if (newValue) {
      Cookies.set('activemonth', newValue.toString());
    } else {
      Cookies.remove('activemonth');
    }

    activeAddMutation.mutate({ mockId: newValue }, {
      onSuccess: () => refetch()
    });
  };

  const addMock = (date) => {
    addMonthMuation.mutate({ month: date });
  };

  const handledelete = (id) => {
    deleteMonthMuation.mutate(id);
  };

  if (isLoading) return <div style={{minHeight:'100vh'}}> <Loader /></div>;

  return (
      <GlobalContainer>
        <BannerComponent info="Mock creation and management page" />
        <Container>
          <h2>Monthly Mock Test <CreateMockModal addMock={addMock} /></h2>
          <CardList>
            {allMonths?.length > 0 ? (
              allMonths.map((item) => (
                <CardItem key={item.id}>
                  <p>ID: {item.id}</p>
                  <CardTitle>{item.month}</CardTitle>
                  <div className="btnbox">
                    <Link className='link' href={`/admin/mock/${item.id}`}>
                      <ViewButton>View</ViewButton>
                    </Link>
                    <ActiveButton
                      activemontCookies={activeMockId === item.id}
                      onClick={() => handleActive(item.id)}
                    >
                      {activeMockId === item.id ? 'Active' : 'Inactive'}
                    </ActiveButton>
                    <DeleteMock handledelete={handledelete} id={item.id} info={`Be careful when deleting, otherwise the data cannot be restored!`} />
                  </div>
                </CardItem>
              ))
            ) : (
              <NoResult message="Mock tests are not available." />
            )}
          </CardList>
        </Container>
      </GlobalContainer>
  );
}

export default Adminpage
