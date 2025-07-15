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
import DeleteMock from '@/components/admin/CreateMockModal/DleteMock'
import CreateMockModal from '@/components/admin/CreateMockModal/CreateMockModal'
import { useaddMonth, usedeleteMonth, usegetMonth } from '@/hooks/mockMonth'
import Loader from '@/components/loader/Loader'
import { useAddActiveMonhId, useLatestMonth } from '@/hooks/useLatestMonth'
import Cookies from 'js-cookie'
import NoResult from '@/components/NoResult'

function Adminpage() {
  const { data: allMonths, isLoading } = usegetMonth();
  const { data: activeMonth, refetch } = useLatestMonth(); // <- active holatni olish
  const addMonthMuation = useaddMonth();
  const deleteMonthMuation = usedeleteMonth();
  const activeAddMutation = useAddActiveMonhId(); // <- aktiv qilish funksiyasi
  console.log(Cookies.get('activemonth'))
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

  if (isLoading) return <Loader />;

  return (
    <GlobalContainer>
      <BannerComponent info="Mocklar yaratish va boshqarish sahifasi" />
      <Container>
        <h2>Oylik Mock Testlar <CreateMockModal addMock={addMock} /></h2>
        <CardList>
          {allMonths.length > 0 ? (
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
                  <DeleteMock handledelete={handledelete} id={item.id} info={`O‘chirishda ehtiyot bo‘ling, qayta tiklab bo‘lmaydi!`} />
                </div>
              </CardItem>
            ))
          ) : (
            <NoResult message="Mock testlar mavjud emas" />
          )}
        </CardList>
      </Container>
    </GlobalContainer>
  );
}

export default Adminpage
